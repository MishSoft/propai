import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. გამოვრიცხოთ ყველა ფაილი და API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. საჯარო გვერდები - აქ დავამატოთ შემოწმება
  const isPublicPage =
    pathname.startsWith('/agent') ||
    pathname.startsWith('/listings') ||
    pathname === '/login' ||
    pathname === '/register';

  if (isPublicPage) {
    return NextResponse.next();
  }

  // 3. დაცული გვერდების შემოწმება
  // getToken-ს ვამატებთ პარამეტრებს, რომ Vercel-ზე არ "დაიბნეს"
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // აი ეს ხაზი დაამატე აუცილებლად:
    secureCookie: process.env.NODE_ENV === "production",
  });

  // თუ მთავარ გვერდზე ხარ და სესია არ გაქვს -> Login
  if (pathname === '/' && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // თუ დალოგინებული ხარ და ცდილობ /login-ზე შესვლას -> Dashboard
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
