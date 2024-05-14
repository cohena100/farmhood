"use client";

import { newOrder } from "@/lib/actions/order";
import { Alert, Button } from "flowbite-react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

interface SubmitButtonProps {
  message: string;
}

export function NewOrderButton({ message }: SubmitButtonProps) {
  const t = useTranslations("home");
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      {message && (
        <Alert className="self-start" color="success">
          {message}
        </Alert>
      )}
      <Button
        onClick={async () => {
          startTransition(async () => {
            await newOrder();
          });
        }}
        gradientDuoTone="pinkToOrange"
        disabled={pending}
        isProcessing={pending}
        className="size-fit"
      >
        {t("New order")}
      </Button>
    </div>
  );
}
