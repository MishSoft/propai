import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. ავტორიზაციის შემოწმება
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    // @ts-ignore
    const userPlan = (session.user.plan || "lite").toLowerCase();

    const body = await req.json();

    // 2. ლიმიტების შემოწმება
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

    // 3. მონაცემების ამოღება და გარდაქმნა
    const {
      city,
      street,
      price,
      rooms,
      baths,
      sqft,
      description,
      images,
      category,      // 🔥 ახალი: Sale ან Rent
      propertyType,  // 🔥 ახალი: Apartment ან House
      condition,     // 🔥 ახალი: New ან Old
      floor          // 🔥 ახალი: სართული
    } = body;

    // უსაფრთხო გარდაქმნა რიცხვებად
    const safePrice = parseInt(price) || 0;
    const safeBeds = parseInt(rooms) || 0;
    const safeBaths = parseInt(baths) || 0;
    const safeSqft = parseInt(sqft) || 0;
    const safeFloor = parseInt(floor) || 1;

    // 4. პოსტის შექმნა განახლებულ ბაზაში
    const newPost = await db.post.create({
      data: {
        title: street || "No Title",
        city: city || "Unknown",
        street: street || "Unknown",
        price: safePrice,
        beds: safeBeds,
        baths: safeBaths,
        sqft: safeSqft,
        floor: safeFloor,              // 🔥
        category: category || "Sale",   // 🔥
        propertyType: propertyType || "Apartment", // 🔥
        condition: condition || "New",  // 🔥
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

    return NextResponse.json(newPost, { status: 201 });

  } catch (error: any) {
    console.error("Listing POST Error:", error);
    return NextResponse.json(
      { error: "სერვერის შეცდომა: " + (error.message || "Unknown error") },
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
    return NextResponse.json(listings);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "განცხადებების წამოღება ვერ მოხერხდა" }, { status: 500 });
  }
}
