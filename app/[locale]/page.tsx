import StartButtons from "@/components/start-buttons";
import { validateRequest } from "@/lib/actions/auth";
import { redirect } from "@/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) redirect("/order");
  return (
    <main className="flex flex-col gap-y-4 justify-center items-center h-screen invisible">
      <StartButtons />
    </main>
  );
}
