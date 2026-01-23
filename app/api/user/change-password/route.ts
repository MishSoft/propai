import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // ავტორიზაციის შემოწმება
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // 1. ვიპოვოთ მომხმარებელი ბაზაში
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { password: true } // მხოლოდ პაროლი გვჭირდება
    });

    if (!user || !user.password) {
      return NextResponse.json({ message: "User not found or using social login" }, { status: 404 });
    }

    // 2. შევადაროთ ძველი პაროლი ჰეშირებულს
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // 3. ახალი პაროლის დაჰეშირება
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. განახლება ბაზაში
    await db.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error: unknown) {
    console.error("Password Change Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
