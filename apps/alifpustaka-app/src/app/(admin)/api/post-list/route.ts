// app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { JWT } from 'next-auth';

interface PostPSQLType {
  title: string;
  id: string;
  slug: string;
  uploadTime: Date;
  tags: TagType[];
  content: string;
  image: string;
  status: string;
  desc: string;
  footnote: string;
  userId: string;
}

interface TagType {
  tag: {
    name: string;
    id: string;
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const skip = searchParams.get('skip');
  const maxContent = searchParams.get('max');

  if (!sort || !order || !maxContent || !skip) {
    return NextResponse.json({
      success: false,
      message: 'Missing required parameter.',
      data: null,
      error: 'no-required-parameter',
    });
  }

  const sortFilter = ['title', 'slug', 'type', 'size', 'uploadTime'];
  const orderFilter = ['asc', 'desc'];
  const maxContentFilter = ['10', '20', '50'];

  if (
    !sortFilter.includes(sort) ||
    !orderFilter.includes(order) ||
    !maxContentFilter.includes(maxContent)
  ) {
    return NextResponse.json({
      success: false,
      message: 'Mis-match parameter value.',
      data: null,
      error: 'mismatch-parameter-value',
    });
  }

  const skipAsNum = parseInt(skip, 0) || 0;
  const maxContentAsNum = parseInt(maxContent, 10) || 10;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.username) {
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

  return getImageList(search, sort, order, skipAsNum, maxContentAsNum, token);
}

const getImageList = async (
  search: string,
  sort: string,
  order: string,
  skip: number,
  maxContent: number,
  token: Partial<JWT>,
) => {
  try {
    const list = await prisma.post.findMany({
      where: {
        userId: token.id,
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive', // Optional: for case-insensitive search
            },
          },
          {
            slug: {
              contains: search,
              mode: 'insensitive', // Optional: for case-insensitive search
            },
          },
        ],
      },
      orderBy: {
        [sort]: order,
      },
      skip: skip,
      take: maxContent,
      include: {
        tags: {
          include: {
            tag: true, // Include the full tag data from the Tag model
          },
        },
      },
    });

    if (list.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No post found.',
        data: [],
        error: null,
      });
    } else {
      const listWithTagNames = list.map((g: PostPSQLType) => ({
        ...g,
        tags: g.tags.map((gt) => gt.tag.name), // -> ["tag1","tag2", ...]
      }));
      return NextResponse.json({
        success: true,
        message: `Found ${list.length} posts.`,
        data: listWithTagNames,
        error: null,
      });
    }
  } catch (error) {
    console.error('Error fetch post list: ', error);
    return NextResponse.json({
      success: true,
      message: `Error found posts.`,
      data: null,
      error: error,
    });
  }
};
