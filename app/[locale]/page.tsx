import { UserButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <main className="h-screen">
      <h1>{t("hello")}</h1>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
