import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET || "your-secret-key-123");

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

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      fullName: user.name
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    // 2. პასუხის მომზადება
    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, fullName: user.name }
    }, { status: 200 });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
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
