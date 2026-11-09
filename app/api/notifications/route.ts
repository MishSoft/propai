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
          where: { id: { in: buyerIds }, authorId: (session.user as any).id },
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

    return NextResponse.json(notificationsWithPresentation);
  } catch (error) {
    console.error("NOTIFICATION_GET_ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
