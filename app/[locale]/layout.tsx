import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeModeScript, Flowbite } from "flowbite-react";
import { cn } from "@/lib/utils";
import { getLangDir } from "rtl-detect";
import TopNavbar from "@/components/top-navbar";
import { validateRequest } from "@/lib/actions/auth";
import prisma from "@/lib/prismadb";

const inter = Inter({ subsets: ["latin"], preload: true });

export const metadata: Metadata = {
  title: {
    template: "%s | Farmhood",
    default: "Farmhood",
  },
  description: "From the farm to the neighborhood.",
};

interface RootLayoutParams {
  readonly children: React.ReactNode;
  readonly params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutParams) {
  const messages = await getMessages();
  const direction = getLangDir(locale);
  const { user } = await validateRequest();
  const profile =
    user &&
    (await prisma.profile.findUnique({
      where: { id: user.id },
    }));

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className={cn("dark:bg-gray-900", inter.className)}>
          <Flowbite>
            <TopNavbar profile={profile} />
            {children}
          </Flowbite>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
