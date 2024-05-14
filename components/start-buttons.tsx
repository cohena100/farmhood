"use client";

import { Label, Button, TextInput } from "flowbite-react";
import ContinueButton from "@/components/continue-button";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import useTextDirection from "@/lib/hooks";
import { login, signup } from "@/lib/actions/auth";
import { AuthForm } from "./auth-form";

export default function StartButtons() {
  const t = useTranslations("home");
  gsap.registerPlugin(useGSAP);
  const direction = useTextDirection();
  const container = useRef(null);
  useGSAP(
    () => {
      gsap
        .timeline()
        .from(".buttons", {
          x: direction === "rtl" ? -100 : 100,
          duration: 2,
          autoAlpha: 0,
          stagger: 0.5,
          ease: "back",
        })
        .from(
          ".separators",
          {
            x: direction === "rtl" ? 100 : -100,
            duration: 2,
            autoAlpha: 0,
            ease: "back",
          },
          0
        );
    },
    { scope: container }
  );
  return (
    <div ref={container}>
      <div className="buttons invisible">
        <AuthForm action={signup}>
          <Label htmlFor="username" value={t("Username")} />
          <TextInput id="username" name="username" type="text" required />
          <Label htmlFor="password" value={t("Password")} />
          <TextInput id="password" name="password" type="password" required />
          <Button
            type="submit"
            gradientDuoTone="pinkToOrange"
            className="mt-4"
            outline
          >
            {t("One time registration")}
          </Button>
        </AuthForm>
      </div>
      <div className="separators invisible my-1">
        <Label>🍓🥒🫐🍅</Label>
      </div>
      <div className="buttons invisible">
        <AuthForm action={login}>
          <Label htmlFor="password" value={t("Password")} />
          <TextInput id="password" name="password" type="password" required />
          <Button
            type="submit"
            gradientDuoTone="tealToLime"
            className="mt-4"
            outline
          >
            {t("Re-entry")}
          </Button>
        </AuthForm>
      </div>
      <div className="separators invisible my-1">
        <Label>🍓🥒🫐🍅</Label>
      </div>
      <div className="buttons invisible">
        <ContinueButton label={t("Continue")} />
      </div>
    </div>
  );
}
