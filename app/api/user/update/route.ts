import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import db from "@/lib/db";
import { authOptions } from "@/lib/auth";

// ტიპი შემოსული მონაცემებისთვის
interface UpdateRequestBody {
  name?: string;
  bio?: string;
  aiTone?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. ავტორიზაციის შემოწმება
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateRequestBody = await req.json();
    const { name, bio, aiTone } = body;

    // 2. ბაზის განახლება
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        name: name,
        // შენიშვნა: დარწმუნდი რომ ეს ველები გაქვს Prisma-ს მოდელში
        // bio: bio,
        // aiTone: aiTone
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: { name: updatedUser.name }
    }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
