import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from "next-intl";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import {
  UserButton,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { enUS, deDE, heIL, ruRU } from "@clerk/localizations";
import { Button, ThemeModeScript } from "flowbite-react";
import {
  Flowbite,
  DarkThemeToggle,
  Label,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { cn } from "@/lib/utils";
import useTextDirection from "@/lib/hooks";

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

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutParams) {
  const messages = useMessages();
  const clerkLocale: Record<string, typeof enUS> = {
    en: enUS,
    de: deDE,
    re: ruRU,
    he: heIL,
  };
  const direction = useTextDirection(locale);
  const t = useTranslations("home");
  return (
    <ClerkProvider localization={clerkLocale[locale]}>
      <html lang={locale} dir={direction} suppressHydrationWarning>
        <head>
          <ThemeModeScript />
        </head>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <body className={cn("dark:bg-gray-900", inter.className)}>
            <Flowbite>
              <Navbar fluid border>
                <NavbarBrand>
                  <Label className=" text-xl font-semibold text-pink-600 dark:text-pink-600">
                    תותים משק אריאל במדע🍓🍓🍓
                  </Label>
                </NavbarBrand>
                <NavbarToggle />
                <NavbarCollapse>
                  <div className="flex gap-3 items-center">
                    <DarkThemeToggle />
                    <LocaleSwitcher />
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </NavbarCollapse>
              </Navbar>
              <SignedIn>{children}</SignedIn>
              <SignedOut>
                <div className="flex flex-col gap-y-4 justify-center items-center h-screen">
                  <SignUpButton mode="modal">
                    <Button gradientDuoTone="pinkToOrange" outline>
                      {t("One time registration")}
                    </Button>
                  </SignUpButton>
                  <Label>🍓🥒🫐🍅</Label>
                  <SignInButton mode="modal">
                    <Button gradientDuoTone="tealToLime" outline>
                      {t("Re-entry")}
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
            </Flowbite>
          </body>
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
