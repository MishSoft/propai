import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ka', 'ru'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    // 2. ვეუბნებით TS-ს, რომ locale ნამდვილად String-ია და არა undefined
    locale: locale as string,
    messages: (await import(`./language/${locale}.json`)).default,
    timeZone: 'Asia/Tbilisi'
  };
});
