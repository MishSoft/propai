import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    // 1. ბოლო 3 აქტივობა (ბოლო 3 პოსტი)
    const recentListings = await db.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 3, // მხოლოდ ბოლო სამი
      select: {
        id: true,
        street: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ recentListings });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching activities" }, { status: 500 });
  }
}
