import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 1. უსაფრთხოების შემოწმება
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. მონაცემების წამოღება (ოპტიმიზებული ქუერი)
    const recentListings = await db.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        street: true,
        price: true, // დავამატოთ ფასიც ინფორმატიულობისთვის
        category: true, // "Sale" თუ "Rent"
        createdAt: true,
      }
    });

    // 3. Response Header-ის დამატება (Cache-Control)
    // თუ მონაცემები ძალიან ხშირად არ იცვლება, შეგვიძლია ბრაუზერს ვუთხრათ, რომ ცოტა ხნით დაიმახსოვროს
    return NextResponse.json(
      { recentListings },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0', // Dashboard-ისთვის ჯობს ყოველთვის ახალი იყოს
        }
      }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ DASHBOARD_GET_ERROR:", message);

    return NextResponse.json(
      { error: "აქტივობების წამოღება ვერ მოხერხდა" },
      { status: 500 }
    );
  }
}
