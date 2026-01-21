import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt' // jose-ს ნაცვლად ვიყენებთ ამას

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. გამოვრიცხოთ სტატიკური ფაილები
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. საჯარო გვერდები
  if (pathname.startsWith('/agent') || pathname.startsWith('/listings') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // 3. დაცული გვერდი (Dashboard)
  if (pathname === '/') {
    // getToken ავტომატურად პოულობს "next-auth.session-token"-ს და შიფრავს სწორად
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-123"
    });

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
