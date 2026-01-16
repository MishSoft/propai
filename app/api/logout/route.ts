import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 1. მოვიპოვოთ წვდომა ქუქიებზე
    const cookieStore = await cookies();

    // 2. წავშალოთ ავტორიზაციის ტოკენი (თუ ასეთი არსებობს)
    // მაშინაც კი თუ ჯერ არ დაგიყენებია, ეს კოდი მზად იქნება მომავლისთვის
    cookieStore.set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0), // ვადაგასულად გამოცხადება (წაშლა)
      path: "/",
    });

    // 3. დავუბრუნოთ წარმატებული პასუხი
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
