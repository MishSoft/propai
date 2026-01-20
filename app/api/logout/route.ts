import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // NextAuth-ის სესიის ქუქიების სახელები
    const sessionCookie = "next-auth.session-token";
    const secureSessionCookie = "__Secure-next-auth.session-token";

    // ორივე შესაძლო ქუქის წაშლა
    cookieStore.set(sessionCookie, "", { expires: new Date(0), path: "/" });
    cookieStore.set(secureSessionCookie, "", { expires: new Date(0), path: "/" });

    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
