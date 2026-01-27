import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. BigInt სერიალიზაციის გლობალური ფიქსი (მნიშვნელოვანია!)
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  plan?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
    }

    const user = session.user as CustomUser;
    const userId = user.id;
    const userPlan = (user.plan || "lite").toLowerCase();

    const body = await req.json();

    const planLimits: Record<string, number> = {
      lite: 5,
      agent: 20,
      pro: 50,
    };

    const limit = planLimits[userPlan] || 5;

    const currentPostsCount = await db.post.count({
      where: { authorId: userId },
    });

    if (currentPostsCount >= limit) {
      return NextResponse.json(
        { error: `თქვენ ამოწურეთ ლიმიტი (${limit} პოსტი). განაახლეთ პაკეტი.` },
        { status: 403 }
      );
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

    // უსაფრთხო გარდაქმნა და დამრგვალება (რომ 899999 არ ჩაიწეროს)
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
        price: safePrice,
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
          connect: { id: userId }
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

    // BigInt პატჩის წყალობით, აქ ერორი აღარ მოხდება
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error("Listing POST Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "სერვერის შეცდომა: " + errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const listings = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
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

    // BigInt პატჩი აქაც ავტომატურად იმუშავებს,
    // მაგრამ ფასის Number-ად გარდაქმნა მაინც კარგი პრაქტიკაა frontend-ისთვის
    const safeListings = listings.map(l => ({
      ...l,
      price: Number(l.price)
    }));

    return NextResponse.json(safeListings);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "განცხადებების წამოღება ვერ მოხერხდა" },
      { status: 500 }
    );
  }
}
