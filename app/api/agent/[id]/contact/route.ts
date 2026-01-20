import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params; // მაკლერის ID URL-იდან
    const body = await req.json();

    const agentExists = await db.user.findUnique({
  where: { id: agentId }
});

if (!agentExists) {
  return NextResponse.json({ error: "მაკლერი ვერ მოიძებნა" }, { status: 404 });
}

    const {
      name,
      phone,
      location,
      category,
      propertyType,
      minRooms,
      minBaths,
      budget,
      description
    } = body;

    // 1. ვალიდაცია: სახელი და ნომერი აუცილებელია
    if (!name || !phone) {
      return NextResponse.json({ error: "სახელი და ნომერი აუცილებელია" }, { status: 400 });
    }

    // 2. კლიენტის (Buyer) შექმნა ბაზაში
    const newBuyer = await db.buyer.create({
      data: {
        name,
        phone,
        location,
        category,
        propertyType,
        minRooms: parseInt(minRooms) || 1,
        minBaths: parseInt(minBaths) || 1,
        budget: parseInt(budget) || 0,
        description,
        authorId: agentId, // აი აქ ვაბამთ კონკრეტულ მაკლერს
      },
    });

    return NextResponse.json({ message: "მონაცემები წარმატებით გაიგზავნა" }, { status: 201 });

  } catch (error: any) {
    console.error("CONTACT_FORM_ERROR:", error);
    return NextResponse.json({ error: "გაგზავნისას მოხდა შეცდომა" }, { status: 500 });
  }
}
