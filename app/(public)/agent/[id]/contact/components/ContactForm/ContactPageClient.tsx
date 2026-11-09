"use client";

import Image from "next/image";
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import enMessages from "@/messages/en.json";
import kaMessages from "@/messages/ka.json";
import ruMessages from "@/messages/ru.json";
import * as Select from "@radix-ui/react-select";
import ContactForm from "./ContactForms";

const messagesByLocale = {
  en: enMessages,
  ka: kaMessages,
  ru: ruMessages,
};

type ContactLocale = keyof typeof messagesByLocale;

function isContactLocale(locale: string): locale is ContactLocale {
  return locale in messagesByLocale;
}

interface ContactPageClientProps {
  agentId: string;
  agentName: string;
  agentImage: string | null;
}

export default function ContactPageClient(props: ContactPageClientProps) {
  const currentLocale = useLocale();
  const [locale, setLocale] = useState<ContactLocale>(
    isContactLocale(currentLocale) ? currentLocale : "ka",
  );

  const handleLocaleChange = (nextLocale: string) => {
    if (!isContactLocale(nextLocale)) return;

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    document.documentElement.lang = nextLocale;
    setLocale(nextLocale);
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
      <ContactPageContent
        {...props}
        locale={locale}
        onLocaleChange={handleLocaleChange}
      />
    </NextIntlClientProvider>
  );
}

function ContactPageContent({
  agentId,
  agentName,
  agentImage,
  locale,
  onLocaleChange,
}: ContactPageClientProps & {
  locale: ContactLocale;
  onLocaleChange: (locale: string) => void;
}) {
  const t = useTranslations("ContactForm");

  return (
    <div className="min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] bg-gray-50 px-4 py-10 font-sans sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex justify-end">
          <Select.Root
            value={locale}
            onValueChange={onLocaleChange}
          >
            <Select.Trigger
              aria-label={t("language_label")}
              className="group/locale inline-flex min-h-10 min-w-32 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500"
            >
              <Select.Value />
              <Select.Icon
                aria-hidden="true"
                className="shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]/locale:rotate-180"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                </svg>
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                position="popper"
                align="end"
                sideOffset={4}
                collisionPadding={8}
                className="z-[1100] max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-gray-200 bg-white p-1 text-slate-700 shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-150 ease-out"
              >
                <Select.Viewport className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto overscroll-contain touch-pan-y">
                  <Select.Item
                    value="ka"
                    className="flex min-h-10 cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-800 data-[state=checked]:font-semibold data-[state=checked]:text-blue-700"
                  >
                    <Select.ItemText>ქართული</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="en"
                    className="flex min-h-10 cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-800 data-[state=checked]:font-semibold data-[state=checked]:text-blue-700"
                  >
                    <Select.ItemText>English</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="ru"
                    className="flex min-h-10 cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-800 data-[state=checked]:font-semibold data-[state=checked]:text-blue-700"
                  >
                    <Select.ItemText>Русский</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="mb-10 flex flex-col items-center gap-8 rounded-[2.5rem] border border-white bg-white/70 p-8 shadow-sm backdrop-blur-md md:flex-row">
          <div className="relative">
            <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition-transform hover:scale-105">
              {agentImage ? (
                <Image src={agentImage} alt={agentName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-4xl text-white">
                  <BiUserCircle aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{agentName}</h1>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-medium md:justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-indigo-100/50 bg-indigo-50 px-4 py-2 text-indigo-700">
                <BiUserCircle className="text-lg" aria-hidden="true" />
                <span>{t("professional_agent")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-gray-100 bg-white p-8 shadow-xl md:p-12">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">{t("title")}</h2>
            <p className="text-sm text-gray-500">{t("subtitle")}</p>
          </div>
          <ContactForm agentId={agentId} />
        </div>
      </div>
    </div>
  );
}
