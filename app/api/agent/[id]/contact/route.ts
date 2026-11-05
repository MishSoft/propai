import { NextResponse } from "next/server";
import db from "@/lib/db";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/auth-helpers";
import { contactSchema } from "@/lib/validations/contact.schema";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params;

    const body = await req.json().catch(() => null);
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten().fieldErrors,
        },

        { status: 400 },
      );
    }

    const agent = await db.user.findUnique({
      where: { id: agentId, role: "Agent" },
      select: {
        id: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const {
      name,
      phone,
      location,
      category,
      propertyType,
      budget,
      description,
      floor,
      minRooms,
      minBaths,
    } = result.data;

    const newBuyer = await db.$transaction(async (tx) => {
      const buyer = await tx.buyer.create({
        data: {
          name,
          phone,
          location: location || "თბილისი",
          category,
          propertyType,
          budget,
          description: description || "",
          authorId: agentId,
          floor,
          minRooms,
          minBaths,
        },
      });

      await tx.notification.create({
        data: {
          userId: agentId,
          type: "NEW_BUYER",
          message: `New buyer: ${name} interesting ${category}.`,
          buyerId: buyer.id,
        },
      });

      return buyer;
    });

    logger.info(`New contact lead for agent ${agentId}: ${name} (${phone})`);
    return NextResponse.json({ success: true, newBuyer });
  } catch (error) {
    logger.error("CONTACT_POST_ERROR:", error);
    return handleApiError(error);
  }
}
