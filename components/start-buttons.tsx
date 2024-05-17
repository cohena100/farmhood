"use client";

import { Label } from "flowbite-react";
import ContinueButton from "@/components/continue-button";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import useTextDirection from "@/lib/hooks";
import { AuthSignButtons } from "./auth-sign-buttons";

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
        <AuthSignButtons />
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
