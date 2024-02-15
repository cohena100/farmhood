import { NextIntlClientProvider, useMessages } from "next-intl";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, deDE, heIL } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farmhood",
  description: "From the farm to then neighborhood",
};

interface RootLayoutParams {
  readonly children: React.ReactNode;
  readonly params: { locale: string };
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutParams) {
  const messages = useMessages();
  const clerkLocale: Record<string, typeof enUS> = {
    en: enUS,
    de: deDE,
    he: heIL,
  };
  return (
    <ClerkProvider localization={clerkLocale[locale]}>
      <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <body className={inter.className}>{children}</body>
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
