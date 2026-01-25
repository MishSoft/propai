import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. მიუთითე რომ Promise-ია
) {
  try {
    const { id } = await params; // 2. აუცილებლად გამოიყენე await

    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }

    // 3. წაშლა ბაზიდან
    await db.buyer.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // 4. ეს ამოგიგდებს ტერმინალში ზუსტ მიზეზს (მაგ. Prisma-ს შეცდომას)
    console.error("DETAILED_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "სერვერული შეცდომა წაშლისას" },
      { status: 500 }
    );
  }
}
