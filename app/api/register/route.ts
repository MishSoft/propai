import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isValidPhoneNumber } from "@/lib/phone";
import { password_validation } from "@/lib/validations/password.schema";
import { SafeParseSuccess, SafeParseError } from "zod";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { fullName, email, password, phone } = body as Record<string, unknown>;

  if (
    typeof fullName !== "string" ||
    !fullName.trim() ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { message: "Name, email, and password are required" },
      { status: 400 },
    );
  }

  if (typeof phone !== "string" || !isValidPhoneNumber(phone)) {
    return NextResponse.json(
      { message: "Enter a valid phone number (7 to 15 digits)" },
      { status: 400 },
    );
  }
  const normalizedPhone = phone.trim();

  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(normalizedEmail)) {
    return NextResponse.json(
      { message: "Enter a valid email address" },
      { status: 400 },
    );
  }

  const safePassword = password_validation.safeParse(password);

  if (!safePassword.success) {
    return NextResponse.json(
      {
        message: safePassword.error.issues[0]?.message ?? "Invalid password",
      },
      { status: 400 },
    );
  }

  try {
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists. Sign in using your original method.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        plan: "lite",
        name: fullName.trim(),
        phone: normalizedPhone,
        role: "Agent",
      },
      select: { id: true, email: true, name: true, plan: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists. Sign in using your original method.",
        },
        { status: 409 },
      );
    }
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}


