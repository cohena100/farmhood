"use client";

import { actionForm } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Alert, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { NewOrderButton } from "./new-order-button";
import { Status } from "@prisma/client";

const initialState = {
  success: false,
  message: "",
};

interface SubmitButtonProps {
  orderId: string;
}

export function FormButtons({ orderId }: SubmitButtonProps) {
  const t = useTranslations("home");
  const [orderForm, orderFormAction] = useFormState(
    actionForm.bind(null, orderId, Status.OPEN),
    initialState
  );
  const [payForm, payFormAction] = useFormState(
    actionForm.bind(null, orderId, Status.PAID),
    initialState
  );
  const { pending } = useFormStatus();
  const [isMessage, setIsMessage] = useState(false);
  useEffect(() => {
    if (orderForm.message || payForm.message) {
      setIsMessage(true);
      const timeoutId = setTimeout(() => {
        orderForm.message = "";
        payForm.message = "";
        setIsMessage(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [orderForm, payForm]);
  return (
    <div className="flex flex-col gap-y-4">
      {isMessage && (
        <Alert
          className="self-start animate-bounce"
          color={orderForm.success || payForm.success ? "success" : "failure"}
        >
          {orderForm.message || payForm.message}
        </Alert>
      )}
      {pending ? (
        <div className="flex gap-x-16">
          <Button
            type="submit"
            formAction={orderFormAction}
            gradientDuoTone="pinkToOrange"
            disabled
            isProcessing
          >
            {t("Please wait")}
          </Button>
        </div>
      ) : payForm.success ? (
        <NewOrderButton message="" />
      ) : (
        <div className="flex gap-x-16">
          <Button
            type="submit"
            formAction={orderFormAction}
            gradientDuoTone="pinkToOrange"
          >
            {t("Order")}
          </Button>
          <Button
            type="submit"
            formAction={payFormAction}
            gradientDuoTone="pinkToOrange"
          >
            {t("Pay")}
          </Button>
        </div>
      )}
    </div>
  );
}
