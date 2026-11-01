import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAuthTimeValid, SESSION_EXPIRED_ERROR } from "@/lib/session-policy";
import { getRouteAccess } from "@/lib/proxy-policy";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const access = getRouteAccess(pathname, request.method);

  if (access === "static") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const hasValidSession =
    !!token && !token.error && isAuthTimeValid(token.authAt);

  if (access === "public") {
    if (
      hasValidSession &&
      (pathname === "/login" || pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (hasValidSession) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
  // A token that exists but is no longer valid means the 24-hour session ended.
  if (token) {
    loginUrl.searchParams.set("error", SESSION_EXPIRED_ERROR);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Only Next.js internals are skipped. Every other path, including dotted paths, goes through getRouteAccess.
  matcher: ["/((?!_next/).*)"],
};
