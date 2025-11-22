import { PrismaClient } from "@repo/prisma-config"
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { fname, lname, email, password, username } = body;

  try {
    const findUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (findUser) {
      return NextResponse.json({
        success: false,
        error: 'username-or-email-exist',
        message: 'Username or Email already registered in our database.',
        data: null,
      });
    }
    const user = await prisma.user.create({
      data: { fname, lname, email, password, username },
    });

    return NextResponse.json({
      success: true,
      data: user,
      error: null,
      message: 'Success create user.',
    });
  } catch (error) {
    console.error('Error signup: ', error);

    return NextResponse.json({
      message: 'Error unknown',
      success: false,
      error: 'error-unknown',
      data: null,
    });
  }
}
