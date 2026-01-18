import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET || "your-secret-key-123");

// --- PATCH: განცხადების განახლება (AI ტექსტის შესანახად) ---
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { description } = await req.json();

    // 1. ავტორიზაცია
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
    }

    const verified = await jwtVerify(token, SECRET);
    const userId = verified.payload.id as string;

    // 2. განახლება (მხოლოდ იმ შემთხვევაში, თუ ავტორია)
    const updatedPost = await db.post.update({
      where: {
        id: id,
        authorId: userId // უსაფრთხოების ფილტრი
      },
      data: { description: description },
    });

    return NextResponse.json(updatedPost, { status: 200 });

  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "განახლება ვერ მოხერხდა. შესაძლოა არ გაქვთ უფლება." },
      { status: 500 }
    );
  }
}

// --- DELETE: განცხადების წაშლა (შენი არსებული კოდი) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
    }

    const verified = await jwtVerify(token, SECRET);
    const userId = verified.payload.id as string;

    const listing = await db.post.findUnique({
      where: { id: id }
    });

    if (!listing) {
      return NextResponse.json({ error: "განცხადება ვერ მოიძებნა" }, { status: 404 });
    }

    if (listing.authorId !== userId) {
      return NextResponse.json({ error: "თქვენ არ გაქვთ ამ პოსტის წაშლის უფლება" }, { status: 403 });
    }

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
