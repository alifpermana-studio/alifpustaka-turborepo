import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

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
    const { title, path, slug, size, type, format, tags } = body;

    const gallery = await prisma.gallery.create({
      data: {
        title: title,
        path: path,
        type: type,
        slug: `${slug}${format}`,
        size: size,
        userId: token?.id, // Associate with the user
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
    });

    console.log('Update image db success: ', gallery);

    return NextResponse.json({
      success: true,
      message: 'Update image database success.',
      data: gallery,
      error: null,
    });
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
