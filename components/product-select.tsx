"use client";

import { Label, Radio } from "flowbite-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Prisma } from "@prisma/client";

interface ItemSelectParams {
  product: Prisma.ProductGetPayload<{}>;
  selection: number;
}

export default function ProductSelect({
  product,
  selection,
}: ItemSelectParams) {
  const t = useTranslations("home");
  const container = useRef(null);
  const { contextSafe } = useGSAP({ scope: container });
  const onCheck = contextSafe(() => {
    gsap.timeline().to("label:first-child", {
      y: -10,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  });
  return (
    <div ref={container} key={product.id} className="flex flex-col gap-2">
      <Label>{t(product.title)}</Label>
      <div className="flex gap-4 flex-wrap">
        {product.options.map((v, i) => (
          <div key={product.id + i} className="flex items-center gap-2">
            <Radio
              id={product.id + i}
              name={product.id}
              value={v}
              defaultChecked={selection === v}
              onClick={onCheck}
            />
            <Label htmlFor={product.id + i}>{v}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
