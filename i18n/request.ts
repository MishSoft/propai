import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ka';
  console.log(`[I18N_DEBUG] Detected Locale: ${locale}`);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
