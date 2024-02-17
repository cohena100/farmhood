import { UserButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";
export default async function Home() {
  const t = await getTranslations("home");
  return (
    <main className="h-screen">
      <LocaleSwitcher />
      <h1>{t("hello")}</h1>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
