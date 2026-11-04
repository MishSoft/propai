import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Ensure notification belongs to user
    const notification = await db.notification.findUnique({
      where: { id: id },
    });

    if (!notification) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (notification.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const hasIsDone =
      body !== null && typeof body === "object" && "isDone" in body;

    if (
      hasIsDone &&
      typeof (body as { isDone: unknown }).isDone !== "boolean"
    ) {
      return NextResponse.json(
        { error: "isDone must be a boolean" },
        { status: 400 },
      );
    }

    if (hasIsDone && (body as { isDone: boolean }).isDone === false) {
      return NextResponse.json(
        {
          error: "Notification completion cannot be reversed",
        },
        {
          status: 400,
        },
      );
    }

    const data = hasIsDone ? { isDone: true } : { isRead: true };

    if (hasIsDone) {
      const result = await db.notification.updateMany({
        where: {
          id,
          userId: user.id,
          isDone: false,
        },
        data: { isDone: true },
      });

      if (result.count === 0) {
        return NextResponse.json(
          {
            error: "Notification is already completed",
          },
          {
            status: 409,
          },
        );
      }

      const updatedNotification = await db.notification.findUnique({
        where: { id, userId: user.id },
      });

      return NextResponse.json(updatedNotification);
    }

    const updatedNotification = await db.notification.update({
      where: { id, userId: user.id },
      data: { isRead: true },
    });

    logger.info(
      `Notification ${id} updated by user ${user.id}: ${JSON.stringify(data)}`,
    );
    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
