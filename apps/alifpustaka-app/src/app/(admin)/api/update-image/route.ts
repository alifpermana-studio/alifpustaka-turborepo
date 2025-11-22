import { UpdateImage } from 'apus-gallery';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { RequestChecksumCalculation } from '@aws-sdk/middleware-flexible-checksums';

// Get the access key and secret key from environment variables
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// Ensure both keys are defined, or throw an error
if (!accessKeyId || !secretAccessKey) {
  throw new Error('R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be defined.');
}

const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT_S3_CLIENT, // R2 endpoint
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: 'auto', // Region (Cloudflare R2 uses auto)
  requestChecksumCalculation: RequestChecksumCalculation.WHEN_REQUIRED,
});

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.username || typeof token?.id !== 'string') {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'no-user-token',
    });
  }

  if (typeof token.expires === 'number' && token?.expires <= Date.now()) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'session-expired',
    });
  }

  try {
    const image: UpdateImage = body;

    if (image.slug !== image.oldSlug) {
      const checkSlug = await prisma.gallery.findUnique({
        where: {
          slug: `${image.slug}${image.format}`,
        },
      });

      if (!checkSlug) {
        return R2ImageUpdate(image);
      } else {
        return NextResponse.json({
          success: false,
          message: 'Slug already exist, please provides unique one.',
          data: null,
          error: 'image-slug-exist',
        });
      }
    } else if (image.isPrivate !== image.oldIsPrivate) {
      return R2ImageUpdate(image);
    } else {
      return UpdateImageDatabase(image);
    }
  } catch (error) {
    console.error('Update image db error: ', error);

    return NextResponse.json({
      success: false,
      message: 'Update image db failed.',
      data: null,
      error: error,
    });
  }
}

const R2ImageUpdate = async (image: UpdateImage) => {
  console.log('Check image param: ', image);
  try {
    // 1. Copy object to new bucket
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: `apus-user-${image.isPrivate ? 'private' : 'public'}`,
        CopySource: `/apus-user-${image.oldIsPrivate ? 'private' : 'public'}/${image.oldSlug}${image.format || ''}`,
        Key: `${image.slug}${image.format}`,
      }),
    );

    // 2. Delete from old bucket (optional, to "move" instead of "copy")
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: `apus-user-${image.oldIsPrivate ? 'private' : 'public'}`,
        Key: `${image.oldSlug}${image.format}`,
      }),
    );

    return UpdateImageDatabase(image);
  } catch (error) {
    console.error('Failed update R2 Image: ', error);
    return NextResponse.json({
      success: false,
      message: 'Failed update Image source.',
      error: 'error-update-r2-image',
      data: null,
    });
  }
};

const UpdateImageDatabase = async (image: UpdateImage) => {
  try {
    const res = await prisma.gallery.update({
      where: { id: image.id },
      data: {
        title: image.title,
        path: image.path,
        slug: `${image.slug}${image.format}`,
        size: image.size,
        isPrivate: image.isPrivate,
        isFeatured: image.isFeatured,
        tags: {
          deleteMany: {}, // reset dulu jika perlu
          create: image.tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Update image database success.',
      data: res,
      error: null,
    });
  } catch (error) {
    console.error('Failed update image database: ', error);
    return NextResponse.json({
      success: false,
      message: 'Failed update image database.',
      error: 'error-update-image-psql',
      data: null,
    });
  }
};
