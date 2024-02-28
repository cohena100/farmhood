"use client";

import { submitForm } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Alert, Button, Label } from "flowbite-react";
import { cn } from "@/lib/utils";

const initialState = {
  success: true,
  message: "",
};

interface SubmitButtonProps {
  className: string | null;
  label: string;
}

export function SubmitButton({ className, label }: SubmitButtonProps) {
  const [state, formAction] = useFormState(submitForm, initialState);
  const { pending } = useFormStatus();

  return pending ? (
    <Button
      formAction={formAction}
      className={cn(className)}
      aria-disabled
      isProcessing
      gradientDuoTone="pinkToOrange"
    >
      {label}
    </Button>
  ) : (
    <>
      {state.message && (
        <Alert
          className="self-start"
          color={state.success ? "success" : "failure"}
        >
          {state.message}
        </Alert>
      )}
      <Button
        type="submit"
        formAction={formAction}
        gradientDuoTone="pinkToOrange"
        className={cn(className)}
      >
        {label}
      </Button>
    </>
  );
}
