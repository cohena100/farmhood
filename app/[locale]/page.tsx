import StartButtons from "@/components/start-buttons";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/order");
  return (
    <main className="flex flex-col gap-y-4 justify-center items-center h-screen">
      <StartButtons />
    </main>
  );
}
