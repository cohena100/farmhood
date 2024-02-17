import { UserButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { DarkThemeToggle } from "flowbite-react";

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <main className="h-screen">
      <LocaleSwitcher />
      <DarkThemeToggle />
      <h1>{t("hello")}</h1>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
