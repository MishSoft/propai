import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import { Providers } from "./(main)/components/Providers";
import { ToastProvider } from '@/app/components/feedback/ToastProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "PropAI - Real Estate AI Assistant",
  description: "Manage your properties with AI power",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {


  const messages = await getMessages();
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ka';

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <ToastProvider>{children}</ToastProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
