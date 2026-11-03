import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { AI_TONES } from "@/lib/ai-tone";

const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^\+?[\d\s().-]*$/, "Invalid phone number")
      .refine((value) => {
        if (value === "") return true;
        const digits = value.replace(/\D/g, "").length;
        return digits >= 7 && digits <= 15;
      }, "Phone number must contain 7 to 15 digits")
      .nullable()
      .optional(),
    image: z.string().trim().url().max(2048).nullable().optional(),
    aiTone: z.enum(AI_TONES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "No fields to update");

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, phone, image, aiTone } = parsed.data;
    const normalizedPhone = phone === "" ? null : phone;

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { name, phone: normalizedPhone, image, aiTone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        aiTone: true
      }
    });

    logger.info(`User profile updated for ${user.id}`);
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}
