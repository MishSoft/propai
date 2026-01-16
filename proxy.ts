import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. დაცული გვერდები (ახლა "/" არის შენი დაშბორდი)
  const protectedRoutes = ['/'];
  const authRoutes = ['/login', '/register'];

  // ა) თუ იუზერი ცდილობს მთავარ გვერდზე ("/") შესვლას ტოკენის გარეშე
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ბ) თუ იუზერი ავტორიზებულია და ცდილობს login/register-ზე შესვლას
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      // თუ უკვე შესულია, გადავიყვანოთ მთავარ გვერდზე
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  //Matcher-ში აუცილებლად უნდა იყოს "/"
  matcher: ['/', '/login', '/register', '/profile/:path*'],
}
