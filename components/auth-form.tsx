"use client";

import { useFormState } from "react-dom";

export interface ActionResult {
  error: string | null;
}

interface AuthFormParams {
  children: React.ReactNode;
  action: (
    prevState: any,
    formData: FormData
  ) => Promise<ActionResult | undefined>;
}

export function AuthForm({ children, action }: AuthFormParams) {
  const [state, formAction] = useFormState(action, {
    error: null,
  });
  return (
    <form action={formAction}>
      {children}
      <p>{state?.error}</p>
    </form>
  );
}
