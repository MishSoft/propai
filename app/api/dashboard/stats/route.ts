// app/api/dashboard/stats/route.ts

import { getServerSession } from "next-auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // 1. დავითვალოთ პოსტები
  const listingsCount = await db.post.count({ where: { authorId: userId } });

  // 2. აქ შეიძლება დაამატო Buyers-ის დათვლა, როცა მაგ თეიბლს შექმნი
  const buyersCount = 12; // დროებითი სტატიკური ციფრი

  return NextResponse.json({
    listingsCount,
    buyersCount,
    // აქ დაამატებ სხვა სტატისტიკასაც
  });
}
