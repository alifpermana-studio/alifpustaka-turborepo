import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'no-user-token',
    });
  }

  if (typeof token?.expires === 'number' && token?.expires <= Date.now()) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'session-expired',
    });
  }

  if (!body.action && !body.data) {
    return NextResponse.json({
      success: false,
      message: 'Missing required parameter.',
      data: null,
      error: 'missing-required-parameter',
    });
  }

  if (token.role && typeof token.id === 'string' && typeof token.role === 'string') {
    return updatePost(body.data, token.id, token.role, body.action);
  } else {
    console.error('Missing parameter for blog-post: ', {
      user_role: `${token.role} as ${typeof token.role}`,
      user_id: `${token.id} as ${typeof token.id}`,
    });
    return NextResponse.json({
      success: false,
      message: 'Missing required parameter.',
      data: null,
      error: 'missing-required-parameter',
    });
  }
}

type PostType = {
  id: string;
  title: string;
  slug: string;
  desc: string;
  tags: string[];
  image: string;
  md: string;
  footnote: string;
};

const updatePost = async (post: PostType, userId: string, role: string, action: string) => {
  if (!post.title || !post.slug) {
    return NextResponse.json({
      success: false,
      message: 'The title and slug parameters are required.',
      data: null,
      error: 'missing-required-metadata',
    });
  }
  console.log('Check action: ', action);
  try {
    const reqPost = await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        slug: post.slug,
        desc: post.desc,
        status: action,
        footnote: post.footnote || '',
        content: post.md,
        image: post.image,
        userId: userId,
        tags: {
          // First, remove all tags
          deleteMany: {},

          create: post.tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      create: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        desc: post.desc,
        status: action,
        footnote: post.footnote || '',
        content: post.md,
        image: post.image,
        userId: userId,
        tags: {
          create: post.tags.map((tagName) => ({
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

    console.log('update post: ', reqPost.id);

    if (reqPost) {
      return NextResponse.json({
        success: true,
        message: 'Success publish updated post.',
        data: reqPost,
        error: null,
      });
    } else {
      console.error('Error reqPost: ', reqPost);

      return NextResponse.json({
        success: false,
        message: 'Failed fetch reqPost.',
        data: null,
        error: 'failed-fetch-reqpost',
      });
    }
  } catch (error) {
    console.error('Error update post: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error update post',
      data: null,
      error: 'failed-update-post',
    });
  }
};
