import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- PATCH: განცხადების განახლება ---
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // მიუთითე რომ Promise-ია
) {
  try {
    const { id } = await params; // 🔥 აუცილებელია await
    const { description } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    const updatedPost = await db.post.update({
      where: {
        id: id,
        authorId: userId
      },
      data: { description: description },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// --- DELETE: განცხადების წაშლა ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // აქაც Promise
) {
  try {
    const { id } = await params; // 🔥 აუცილებელია await

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    const listing = await db.post.findUnique({
      where: { id: id } // ახლა id უკვე რეალური სტრინგია და არა Promise
    });

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (listing.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.post.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
