import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// საჯარო გვერდების სია (ენის პრეფიქსის გარეშე)
const PUBLIC_ROUTES = ['/login', '/register', '/agent', '/listings']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. გამოვტოვოთ სტატიკური ფაილები და API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. სესიის შემოწმება
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 3. საჯარო გვერდის შემოწმება
  const isPublicPage = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // 4. გადამისამართების ლოგიკა (Redirect Logic)

  // თუ არაა საჯარო გვერდი და იუზერი არაა დალოგინებული -> Login
  if (!isPublicPage && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // თუ დალოგინებულია და ცდილობს შესვლას login/register-ზე -> Home (/)
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export async function middleware(request: NextRequest) {
  return proxy(request)
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}
