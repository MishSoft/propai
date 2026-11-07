import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

// BigInt serialization global fix
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const planLimits: Record<string, number> = {
      lite: 5,
      agent: 20,
      pro: 50,
      ultimate: 100
    };

    const userPlan = (user.plan || "lite").toLowerCase();
    const limit = planLimits[userPlan] || 5;

    const currentPostsCount = await db.post.count({
      where: { authorId: user.id },
    });

    if (currentPostsCount >= limit) {
      logger.warn(`User ${user.id} reached post limit (${limit})`);
      throw new Error(`Forbidden: You have reached your limit (${limit} posts). Upgrade your plan.`);
    }

    const {
      city,
      street,
      price,
      rooms,
      baths,
      sqft,
      description,
      images,
      category,
      propertyType,
      condition,
      floor
    } = body;

    const safePrice = Math.round(Number(price)) || 0;
    const safeBeds = Number(rooms) || 0;
    const safeBaths = Number(baths) || 0;
    const safeSqft = Number(sqft) || 0;
    const safeFloor = Number(floor) || 1;

    const newPost = await db.post.create({
      data: {
        title: street || "No Title",
        city: city || "Unknown",
        street: street || "Unknown",
        price: BigInt(safePrice),
        beds: safeBeds,
        baths: safeBaths,
        sqft: safeSqft,
        floor: safeFloor,
        category: category || "Sale",
        propertyType: propertyType || "Apartment",
        condition: condition || "New",
        description: description || "",
        images: images || [],
        author: {
          connect: { id: user.id }
        }
      },
      include: {
        author: {
          select: {
            name: true,
            phone: true,
            image: true,
            role: true
          }
        }
      }
    });

    logger.info(`New listing created: ${newPost.id} by user ${user.id}`);
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const user = await requireAuth();

    const listings = await db.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        images: true,
        description: true,
        city: true,
        street: true,
        price: true,
        beds: true,
        baths: true,
        sqft: true,
        floor: true,
        category: true,
        propertyType: true,
        condition: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            phone: true,
            image: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
