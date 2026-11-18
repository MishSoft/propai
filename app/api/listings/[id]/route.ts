import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { descriptionSchema } from "@/lib/validations/contact.schema";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { description } = body;

    const isValidDescription = descriptionSchema.safeParse(description);

    if (!isValidDescription.success) {
      return NextResponse.json(
        {
          message: isValidDescription.error.issues[0]?.message ?? "Invalid description.",
        },
        { status: 400 },
      );
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser) {
      logger.warn(
        `Authenticated user not found in the database. User ID:${user.id}`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const listing = await db.post.findUnique({
      where: { id: id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (listing.authorId !== user.id && dbUser.role !== "Admin") {
      throw new Error("Forbidden: You do not own this listing");
    }

    const updatedPost = await db.post.update({
      where: {
        id: id,
      },
      data: { description: isValidDescription.data },
    });

    logger.info(`Post ${id} updated successfully by user ${user.id}`);
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    logger.error(`Failed to update post ${id}: ${error}`);
    return handleApiError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await requireAuth();

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        role: true,
      },
    });

    if (!dbUser) {
      logger.warn(
        `Authenticated user couldn't be found in Database. User Id:${user.id}`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info(`Attempting to delete post ${id} by user ${user.id}`);

    const listing = await db.post.findUnique({
      where: { id },
    });

    if (!listing) {
      logger.warn(`Post ${id} not found for deletion by user ${user.id}`);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (listing.authorId !== user.id && dbUser.role !== "Admin") {
      logger.warn(
        `User ${user.id} attempted to delete post ${id} without authorization. Role: ${dbUser.role}`,
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.post.delete({
      where: { id },
    });

    logger.info(`Post ${id} deleted successfully by user ${user.id}`);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    logger.error(`Delete failed for post ${id}: ${error}`);
    return handleApiError(error);
  }
}
