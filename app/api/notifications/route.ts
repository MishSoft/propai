import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: (session.user as any).id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // ბოლო 10 შეტყობინება
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("NOTIFICATION_GET_ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
