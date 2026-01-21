import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt"; // აუცილებელი იმპორტი

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and Password are required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "This account uses social login. Please sign in with Google/Facebook." },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 🔥 აი აქ არის მთავარი ცვლილება:
    // ვიყენებთ NextAuth-ის encode-ს, რომ ტოკენი იყოს JWE ფორმატში
    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: "",
        role: ""
      },
      // აუცილებლად გამოიყენე ის საიდუმლო გასაღები, რაც .env-ში გაქვს NEXTAUTH_SECRET-ად
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-123",
      maxAge: 60 * 60 * 24,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 200 });

    // ვინარჩუნებთ შენს ქუქის სახელს, რომ არაფერი აირიოს
    response.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
