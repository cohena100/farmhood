"use client";

import { useTransition } from "react";
import { useRouter } from "@/navigation";
import { Button } from "flowbite-react";

interface Props {
  label: string;
}

export default function ContinueButton({ label }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(() => {
      router.push("/order");
    });
  }
  return (
    <Button
      gradientDuoTone="redToYellow"
      outline
      disabled={isPending}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
