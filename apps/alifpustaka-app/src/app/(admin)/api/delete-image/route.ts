import { ImageGallery } from 'apus-gallery';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

export async function DELETE(req: NextRequest) {
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
    const image: ImageGallery = body;

    const checkSlug = await prisma.gallery.findUnique({
      where: {
        slug: `${image.slug}`,
      },
    });

    if (checkSlug) {
      return R2ImageDelete(image);
    } else {
      return NextResponse.json({
        success: false,
        message: `Your image doesn't exist on Database. Please report to our administrator.`,
        data: null,
        error: 'image-slug-exist',
      });
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

const R2ImageDelete = async (image: ImageGallery) => {
  try {
    // 2. Delete from old bucket (optional, to "move" instead of "copy")
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: `apus-user-${image.isPrivate ? 'private' : 'public'}`,
        Key: `${image.slug}`,
      }),
    );

    return DeleteImageDatabase(image);
  } catch (error) {
    console.error('Failed delete R2 Image: ', error);
    return NextResponse.json({
      success: false,
      message: 'Failed delete Image source. Contact our administrator.',
      error: 'error-delete-r2-image',
      data: null,
    });
  }
};

const DeleteImageDatabase = async (image: ImageGallery) => {
  try {
    // Step 1: delete gallery (cascade removes GalleryTag automatically)
    const deleteImage = await prisma.gallery.delete({
      where: { id: image.id },
    });

    // Step 2: delete orphan tags (tags with no galleries left)
    const deleteTag = await prisma.tag.deleteMany({
      where: {
        galleries: { none: {} }, // keep only tags still linked
      },
    });

    console.log('Success delete image: ', { deleteImage: deleteImage, deleteTag: deleteTag });

    return NextResponse.json({
      success: true,
      message: 'Update image database success.',
      data: `${image.slug}`,
      error: null,
    });
  } catch (error) {
    console.error('Failed delete image database: ', error);
    return NextResponse.json({
      success: false,
      message: 'Failed delete image database. Contact our administrator.',
      error: 'error-update-image-psql',
      data: null,
    });
  }
};
