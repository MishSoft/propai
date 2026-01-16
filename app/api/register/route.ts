import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body;

    // 1. მონაცემების სისრულის შემოწმება
    if (!fullName?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // 2. მეილის ფორმატის ვალიდაცია (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // 3. პაროლის სირთულის შემოწმება
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // 4. არსებული იუზერის შემოწმება
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() } // მეილი შევინახოთ lowercase-ში
    });

    if (existingUser) {
      return NextResponse.json({ message: "This email is already registered" }, { status: 400 });
    }

    // 5. პაროლის ჰეშირება (Salt rounds = 10 ოპტიმალურია)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
      }
    });

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Something went wrong during registration" }, { status: 500 });
  }
}
