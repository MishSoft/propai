import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await requireAuth();

    // 2. მონაცემების წამოღება (ოპტიმიზებული ქუერი)
    const recentListings = await db.post.findMany({
      where: { authorId: user.id },
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
    return handleApiError(error);
  }
}
