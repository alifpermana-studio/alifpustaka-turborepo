// app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { Status, UserRole } from '@repo/prisma-config';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const skip = searchParams.get('skip');
  const maxContent = searchParams.get('max');
  const isSuperAdmin = searchParams.get('req');

  console.log('Check param: ', sort, order, maxContent, skip, isSuperAdmin);

  if (!sort || !order || !maxContent || !skip) {
    return NextResponse.json({
      success: false,
      message: 'Missing required parameter.',
      data: null,
      error: 'no-required-parameter',
    });
  }

  const sortFilter = ['createdAt', 'fname', 'username', 'role', 'roleStatus'];
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

  if (token?.userRole !== UserRole.SUPERADMIN) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for superadmin.',
      data: null,
      error: 'insufficient-role',
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

  return getUserList(search, sort, order, skipAsNum, maxContentAsNum);
}

const getUserList = async (
  search: string,
  sort: string,
  order: string,
  skip: number,
  maxContent: number,
) => {
  try {
    const list = await prisma.user.findMany({
      where: {
        OR: [
          {
            fname: {
              contains: search,
              mode: 'insensitive', // Optional: for case-insensitive search
            },
          },
          {
            lname: {
              contains: search,
              mode: 'insensitive', // Optional: for case-insensitive search
            },
          },
          {
            username: {
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
        roleReq: {
          where: {
            status: Status.PENDING,
          },
          take: 1,
        },
        statusReq: {
          where: {
            status: Status.PENDING,
          },
          take: 1,
        },
      },
    });

    console.log('Check: ', list);

    // 1. Map over the array of users to transform the roleReq field
const convertedList = list.map(user => {
    
    // Destructure the user object, pulling out roleReq separately
    const { roleReq, ...restOfUser } = user;

    // 2. Extract the first element from the roleReq array
    //    and set it to null if the array is empty.
    const singleRoleReq = roleReq?.[0] || null;

    // 3. Return a new user object with the transformed roleReq field
    return {
        ...restOfUser,
        roleReq: singleRoleReq,
        // The type of roleReq is now UserRoleRequest | null
    };
});

    if (list.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No user found.',
        data: [],
        error: 'user-not-found',
      });
    } else {
      return NextResponse.json({
        success: true,
        message: `Found ${convertedList.length} users.`,
        data: convertedList,
        error: null,
      });
    }
  } catch (error) {
    console.error('Error fetch user list: ', error);
    return NextResponse.json({
      success: true,
      message: `Error found users.`,
      data: null,
      error: error,
    });
  }
};
