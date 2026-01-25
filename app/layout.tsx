import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // გზა შეიცვალა, რადგან ფაილი ერთი დონით შიგნით შევიდა // გამოიყენე @/ რომ გზა არ აირიოს
import { getMessages } from 'next-intl/server';
import { Providers } from "./(main)/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata-ს ენის მიხედვით მართვაც შეგვიძლია, მაგრამ ჯერ ასე დავტოვოთ
export const metadata: Metadata = {
  title: "PropAI - Real Estate AI Assistant",
  description: "Manage your properties with AI power",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {


  // სერვერიდან ვკითხულობთ შესაბამის JSON ფაილს (en.json, ka.json...)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
