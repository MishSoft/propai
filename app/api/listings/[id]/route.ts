import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET || "your-secret-key-123");

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // მივუთითოთ რომ ეს არის Promise
) {
  try {
    // 1. ჯერ "გავხსნათ" params
    const { id } = await params;

    // 2. ავტორიზაციის შემოწმება
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
    }

    const verified = await jwtVerify(token, SECRET);
    const userId = verified.payload.id as string;

    // 3. მოვძებნოთ პოსტი ბაზაში
    const listing = await db.post.findUnique({
      where: { id: id }
    });

    if (!listing) {
      return NextResponse.json({ error: "განცხადება ვერ მოიძებნა" }, { status: 404 });
    }

    // 4. შევამოწმოთ, არის თუ არა მომხმარებელი ამ პოსტის ავტორი
    if (listing.authorId !== userId) {
      return NextResponse.json({ error: "თქვენ არ გაქვთ ამ პოსტის წაშლის უფლება" }, { status: 403 });
    }

    // 5. წავშალოთ პოსტი
    await db.post.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "წარმატებით წაიშალა" }, { status: 200 });

  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "სერვერის შეცდომა წაშლისას" },
      { status: 500 }
    );
  }
}
