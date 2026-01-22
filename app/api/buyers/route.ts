import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const buyers = await db.buyer.findMany({
      where: { authorId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(buyers);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
