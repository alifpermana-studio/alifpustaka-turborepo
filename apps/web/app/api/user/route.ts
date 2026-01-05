import { prisma } from "@repo/prisma-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await prisma.user.findMany();

    console.log("Check user: ", user);

    return NextResponse.json({
      success: true,
      message: "success is yes",
      data: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed",
      data: null,
      error: null,
    });
  }
}
