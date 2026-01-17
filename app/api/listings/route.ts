import { NextResponse } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// დარწმუნდი, რომ ეს Secret ემთხვევა შენი ავტორიზაციის Secret-ს
const SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET || "your-secret-key-123");

export async function POST(req: Request) {
  try {
    // 1. ავტორიზაციის შემოწმება
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
    }

    let payload;
    try {
      const verified = await jwtVerify(token, SECRET);
      payload = verified.payload;
    } catch (err) {
      return NextResponse.json({ error: "სესია ამოიწურა, თავიდან გაიარეთ ავტორიზაცია" }, { status: 401 });
    }

    const userId = payload.id as string;
    const body = await req.json();

    // 2. მონაცემების ამოღება და გარდაქმნა (NaN-ის პრევენცია)
    const { city, street, price, rooms, baths, sqft, description, images } = body;

    const safePrice = parseInt(price) || 0;
    const safeBeds = parseInt(rooms) || 0;
    const safeBaths = parseInt(baths) || 0;
    const safeSqft = parseInt(sqft) || 0;

    // 3. პოსტის შექმნა
    const newPost = await db.post.create({
      data: {
        title: street || "No Title",
        city: city || "Unknown",
        street: street || "Unknown",
        price: safePrice,
        beds: safeBeds,
        baths: safeBaths,
        sqft: safeSqft,
        description: description || "",
        images: images || [],
        // დაკავშირება ავტორთან (User)
        author: {
          connect: { id: userId }
        }
      },
      // პასუხშივე გამოვაყოლოთ ავტორის მონაცემები
      include: {
        author: {
          select: {
            fullName: true,
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
      orderBy: {
        createdAt: 'desc'
      },
      // აუცილებელია Frontend-ისთვის, რომ აგენტის ინფორმაცია გამოჩნდეს
      include: {
        author: {
          select: {
            fullName: true,
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
    return NextResponse.json(
      { error: "განცხადებების წამოღება ვერ მოხერხდა" },
      { status: 500 }
    );
  }
}
