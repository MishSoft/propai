import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { requireAuth, handleApiError } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { password_validation } from "@/lib/validations/password.schema";

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    let body: unknown;

    try {
      const parse = await req.json();
      body = parse;
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Request body must be a valid JSON object." },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = body as Record<string, unknown>;

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          message: "Authenticated user not found in the database",
        },
        {
          status: 404,
        },
      );
    }

    if (!dbUser.password) {
      return NextResponse.json(
        {
          message:
            "This account does not have a local password. Please sign in using your connected provider.",
        },
        { status: 409 },
      );
    }

    if (typeof newPassword !== "string") {
      return NextResponse.json(
        { message: "New password must be a string." },
        { status: 400 },
      );
    }

    const safePassword = password_validation.safeParse(newPassword);

    if (!safePassword.success) {
      return NextResponse.json(
        {
          message: safePassword.error.issues[0]?.message ?? "Invalid password",
        },
        { status: 400 },
      );
    }

    if (typeof currentPassword !== "string") {
      return NextResponse.json(
        { message: "Current password must be a string." },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isValid) {
      logger.security(`FAILED_PASSWORD_CHANGE_ATTEMPT: user=${user.id}`);
      return NextResponse.json(
        {
          message: "Invalid current password.",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    logger.info(`Password changed successfully for user ${user.id}`);
    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
