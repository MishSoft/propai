import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ყურადღება: ფრონტიდან მოდის fullName, email, password, plan
    const { fullName, email, password, plan } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        plan: plan || "lite",
        // აქ არის მთავარი წერტილი:
        // თუ სქემაში გადააკეთე 'name'-ზე, გამოიყენე name: fullName
        // თუ ისევ 'fullName' გქვია სქემაში, გამოიყენე fullName: fullName
        name: fullName,
        role: "Agent"
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    // ეს დაგვიბეჭდავს რეალურ შეცდომას ტერმინალში
    console.error("PRISMA_CREATE_ERROR:", error);

    // თუ შეცდომაა იმაზე რომ 'name' არ არსებობს, გვეტყვის
    return NextResponse.json({
      message: "Internal Server Error",
      error: error.message
    }, { status: 500 });
  }
}
