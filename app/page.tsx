import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="h-screen">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
