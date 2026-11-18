import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await requireAuth();
    logger.info(`Fetching buyers for agent ${user.id}`);

    const buyers = await db.buyer.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(buyers, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
