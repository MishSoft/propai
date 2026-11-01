import { NextResponse } from "next/server";
import { handleApiError, requireAuth } from "@/lib/auth-helpers";
import db from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let user: Awaited<ReturnType<typeof requireAuth>>;

  try {
    user = await requireAuth();
  } catch (error) {
    return handleApiError(error);
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }

    const result = await db.buyer.deleteMany({
      where: { id, authorId: user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DETAILED_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "სერვერული შეცდომა წაშლისას" },
      { status: 500 },
    );
  }
}
