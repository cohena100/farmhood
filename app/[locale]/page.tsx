import { getTranslations } from "next-intl/server";
import { Label, Button } from "flowbite-react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import ContinueButton from "@/components/continue-button";
export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/order");
  const t = await getTranslations("home");
  return (
    <main className="flex flex-col gap-y-4 justify-center items-center h-screen">
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
      <Label>🍓🥒🫐🍅</Label>
      <ContinueButton label={t("Continue")} />
    </main>
  );
}
