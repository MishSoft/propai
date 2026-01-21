import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agentId } = await params;
    const body = await req.json();
    const { name, phone, location, category, propertyType, budget, description } = body;

    // 1. Buyer-ის შექმნა (ეს ხომ მუშაობს)
    const newBuyer = await db.buyer.create({
      data: {
        name,
        phone: String(phone),
        location: location || "თბილისი",
        category,
        propertyType,
        budget: Number(budget) || 0,
        description: description || "",
        authorId: agentId,
      },
    });

    // 2. დიაგნოსტიკა: ვნახოთ რას ხედავს DB ობიექტი
    console.log("Available models in DB:", Object.keys(db));

    // 3. უსაფრთხო ჩაწერა - მივმართოთ დინამიურად
    const modelName = 'notification';
    if (modelName in db) {
      await (db as any)[modelName].create({
        data: {
          userId: agentId,
          type: "NEW_BUYER",
          message: `ახალი კლიენტი: ${name} დაინტერესდა ${category}.`,
          buyerId: newBuyer.id,
        }
      });
    } else {
      console.error("❌ Notification model still not found in Prisma Client!");
    }

    return NextResponse.json({ success: true, newBuyer });

  } catch (error) {
    console.error("CONTACT_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
