"use client";

import { login, signup } from "@/lib/actions/auth";
import { useFormState } from "react-dom";
import { Label, Button, TextInput, Alert } from "flowbite-react";
import { useTranslations } from "next-intl";
import { error } from "console";
import { useEffect, useState } from "react";

interface ActionResult {
  error: string | null;
}

interface AuthSignButtons {}

export function AuthSignButtons() {
  const t = useTranslations("home");
  const [signUpState, signUpAction] = useFormState<
    ActionResult | undefined,
    FormData
  >(signup, {
    error: null,
  });
  const [logInState, logInAction] = useFormState<
    ActionResult | undefined,
    FormData
  >(login, {
    error: null,
  });
  const [isMessage, setIsMessage] = useState(false);
  useEffect(() => {
    if (signUpState?.error || logInState?.error) {
      setIsMessage(true);
      const timeoutId = setTimeout(() => {
        if (signUpState) {
          signUpState.error = "";
        }
        if (logInState) {
          logInState.error = "";
        }
        setIsMessage(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [signUpState, logInState]);
  return (
    <form>
      <Label htmlFor="username" value={t("Username")} />
      <TextInput id="username" name="username" type="text" required />
      <Label htmlFor="password" value={t("Password")} />
      <TextInput id="password" name="password" type="password" required />
      <div className="flex gap-4">
        <Button
          type="submit"
          gradientDuoTone="pinkToOrange"
          className="mt-4"
          outline
          formAction={signUpAction}
        >
          {t("One time registration")}
        </Button>
        <Button
          type="submit"
          gradientDuoTone="tealToLime"
          className="mt-4"
          outline
          formAction={logInAction}
        >
          {t("Re-entry")}
        </Button>
      </div>
      {isMessage && (
        <Alert color="failure" className="mt-2 animate-pulse">
          {signUpState?.error || logInState?.error}
        </Alert>
      )}
    </form>
  );
}
