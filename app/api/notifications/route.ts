import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await requireAuth();
    logger.info(`Fetching notifications for user ${user.id}`);

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const buyerIds = [
      ...new Set(
        notifications.flatMap((notification) =>
          notification.type === "NEW_BUYER" && notification.buyerId
            ? [notification.buyerId]
            : [],
        ),
      ),
    ];
    const buyers = buyerIds.length
      ? await db.buyer.findMany({
          where: { id: { in: buyerIds }, authorId: user.id },
          select: { id: true, name: true, category: true },
        })
      : [];
    const buyersById = new Map(buyers.map((buyer) => [buyer.id, buyer]));

    const notificationsWithPresentation = notifications.map((notification) => {
      if (notification.type !== "NEW_BUYER" || !notification.buyerId) {
        return notification;
      }

      const buyer = buyersById.get(notification.buyerId);
      if (!buyer?.name.trim()) return notification;

      const category = buyer.category.trim().toLowerCase();
      if (category !== "buy" && category !== "rent") return notification;

      return {
        ...notification,
        presentation: {
          type: "NEW_BUYER" as const,
          buyerName: buyer.name,
          category: category === "buy" ? ("Buy" as const) : ("Rent" as const),
        },
      };
    });

    return NextResponse.json(notificationsWithPresentation, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
