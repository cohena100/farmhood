"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface TemplateParams {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateParams) {
  useGSAP(() => {
    gsap.timeline().from("main", {
      scale: 0.8,
      duration: 2,
      autoAlpha: 0,
      ease: "back",
    });
  }, []);

  return <div>{children}</div>;
}
