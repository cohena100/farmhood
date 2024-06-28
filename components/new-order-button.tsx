"use client";

import { newOrder } from "@/lib/actions/order";
import { Alert, Button } from "flowbite-react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";

interface NewOrderButtonProps {
  message: string;
  orderId: string;
}

export function NewOrderButton({ message, orderId }: NewOrderButtonProps) {
  const t = useTranslations("home");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      {message && (
        <Alert className="self-start" color="success">
          {message}
        </Alert>
      )}{" "}
      <div className="flex gap-x-4">
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
        <Button
          onClick={async () => {
            startTransition(() => {
              router.push(`/order/feedback/${orderId}`);
            });
          }}
          gradientDuoTone="pinkToOrange"
          disabled={pending}
          isProcessing={pending}
          className="size-fit"
        >
          {t("Feedback")}
        </Button>
      </div>
    </div>
  );
}
