import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 🔥 აი აქ შეიცვალა: ვამოწმებთ NextAuth-ის სტანდარტულ ქუქის
  // ლოკალურზე (localhost) სახელი არის 'next-auth.session-token'
  // პროდაქშენზე (HTTPS) შეიძლება იყოს '__Secure-next-auth.session-token'
  const token =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/'];
  const authRoutes = ['/login', '/register'];

  // ა) თუ იუზერი ცდილობს დაცულ გვერდზე შესვლას ტოკენის გარეშე
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ბ) თუ იუზერი ავტორიზებულია და ცდილობს login/register-ზე შესვლას
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/profile/:path*'],
}
