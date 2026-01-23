import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from './i18n' // დარწმუნდი, რომ აქედან აექსპორტებ locales-ს

// 1. ინიციალიზაცია ენების middleware-ისთვის
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
});

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

  // 2. ჯერ გავატაროთ ენების ფილტრში
  // ეს დაამატებს /en/ ან /ka/-ს თუ აკლია URL-ს
  const response = intlMiddleware(request);

  // 3. საჯარო გვერდების შემოწმება (Regex-ით, რადგან ახლა ენის პრეფიქსები გვაქვს)
  // ეს ამოწმებს მაგალითად: /en/login, /ka/agent, /ru/listings და ა.შ.
  const isPublicPage = /\/(ka|en|ru)\/(login|register|agent|listings)/.test(pathname) ||
                       pathname === '/login' ||
                       pathname === '/register';

  // 4. დაცული გვერდების შემოწმება (Session)
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // 5. მიმდინარე ენის ამოღება URL-იდან გადამისამართებისთვის
  const locale = pathname.split('/')[1] || 'en';

  // ლოგიკა: თუ არაა საჯარო და არ აქვს სესია -> Redirect ლოგინზე
  if (!isPublicPage && !session) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ლოგიკა: თუ დალოგინებულია და ცდილობს შესვლას login/register-ზე -> Dashboard
  if (session && (pathname.includes('/login') || pathname.includes('/register'))) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // თუ ყველაფერი რიგზეა, ვაბრუნებთ intlMiddleware-ის მიერ მომზადებულ რესპონსს
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
