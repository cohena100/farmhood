"use client";

import { Label, Button } from "flowbite-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import ContinueButton from "@/components/continue-button";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export default function StartButtons() {
  const t = useTranslations("home");
  gsap.registerPlugin(useGSAP);
  const container = useRef(null);
  useGSAP(
    () => {
      gsap
        .timeline()
        .from(".buttons", {
          x: -100,
          duration: 2,
          autoAlpha: 0,
          stagger: 0.5,
          ease: "back",
        })
        .from(
          ".separators",
          { x: 100, duration: 2, autoAlpha: 0, ease: "back" },
          0
        );
    },
    { scope: container }
  );
  return (
    <div ref={container}>
      <div className="buttons" style={{ visibility: "hidden" }}>
        <SignUpButton mode="modal">
          <Button gradientDuoTone="pinkToOrange" outline>
            {t("One time registration")}
          </Button>
        </SignUpButton>
      </div>
      <div className="separators" style={{ visibility: "hidden" }}>
        <Label>🍓🥒🫐🍅</Label>
      </div>
      <div className="buttons" style={{ visibility: "hidden" }}>
        <SignInButton mode="modal">
          <Button gradientDuoTone="tealToLime" outline>
            {t("Re-entry")}
          </Button>
        </SignInButton>
      </div>
      <div className="separators" style={{ visibility: "hidden" }}>
        <Label>🍓🥒🫐🍅</Label>
      </div>
      <div className="buttons" style={{ visibility: "hidden" }}>
        <ContinueButton label={t("Continue")} />
      </div>
    </div>
  );
}
