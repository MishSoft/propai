import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await requireAuth();
    logger.info(`Fetching dashboard stats for user ${user.id}`);

    const listingsCount = await db.post.count({ 
      where: { authorId: user.id } 
    });

    const buyersCount = await db.buyer.count({
      where: { authorId: user.id }
    });

    const unreadNotificationsCount = await db.notification.count({
      where: { userId: user.id, isRead: false }
    });

    return NextResponse.json({
      listingsCount,
      buyersCount,
      unreadNotificationsCount
    }, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}
