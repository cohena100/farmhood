import StartButtons from "@/components/start-buttons";
import { validateRequest } from "@/lib/actions/auth";
import { redirect } from "@/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) redirect("/order");
  return (
    <main className="invisible flex h-screen flex-col items-center justify-center gap-y-4">
      <StartButtons />
    </main>
  );
}
