import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedNotification = await db.notification.update({
      where: {
        id: id,
        userId: (session.user as any).id // უსაფრთხოებისთვის: მხოლოდ თავისი შეტყობინება რომ შეცვალოს
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
