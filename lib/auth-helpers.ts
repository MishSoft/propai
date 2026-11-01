import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "Admin") {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}

function describeError(error: unknown) {
  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code;
    return {
      name: error.name,
      code: typeof code === "string" ? code : undefined,
    };
  }
  return { name: typeof error };
}

export function handleApiError(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (message.startsWith("Forbidden")) {
    return NextResponse.json({ error: message }, { status: 403 });
  }

  logger.error("API_ERROR", describeError(error));
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
