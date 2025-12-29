import { prisma } from "@repo/prisma-config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await prisma.user.findUnique({ where: { id: "" } });

    console.log("Check user: ", user);

    return NextResponse.json({
      success: true,
      message: "success is yes",
      data: null,
      error: null,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed",
      data: null,
      error: null,
    });
  }
}
