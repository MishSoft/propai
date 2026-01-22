import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agentId } = await params;
    const body = await req.json();

    // 1. აქ დაამატე floor, minRooms და minBaths-ის ამოღება body-დან
    const {
      name,
      phone,
      location,
      category,
      propertyType,
      budget,
      description,
      floor,      // <--- დაემატა
      minRooms,   // <--- დაემატა (რომ ესენიც არ იყოს სულ default)
      minBaths    // <--- დაემატა
    } = body;

    // 2. Buyer-ის შექმნა
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
        // ახლა უკვე ვიყენებთ ფორმიდან მოსულ მნიშვნელობას
        floor: parseInt(floor) || 1,
        minRooms: Number(minRooms) || 1,
        minBaths: Number(minBaths) || 1,
      },
    });

    // 3. შეტყობინების შექმნა (იგივე რჩება)
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
    }

    return NextResponse.json({ success: true, newBuyer });

  } catch (error) {
    console.error("CONTACT_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
