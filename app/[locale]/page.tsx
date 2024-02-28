import { getTranslations } from "next-intl/server";
import { Label, Radio } from "flowbite-react";
import prismadb from "@/lib/prismadb";
import { SubmitButton } from "./submit-button";

export default async function Home() {
  const products = await prismadb.product.findMany();
  const t = await getTranslations("home");
  return (
    <main className="flex flex-col ms-4">
      <form action="" className="flex flex-col mt-2 gap-8">
        {products.map((product) => (
          <fieldset key={product.id} className="flex gap-8">
            <legend className="mb-2">
              <Label>{t(product.title)}</Label>
            </legend>
            {[0, 1, 2, 3, 4].map((v, i) => (
              <div key={product.id + i} className="flex items-center gap-2">
                <Radio
                  id={product.id + i}
                  name={product.id}
                  value={v}
                  defaultChecked={i == 0}
                />
                <Label htmlFor={product.id + i}>{v}</Label>
              </div>
            ))}
          </fieldset>
        ))}
        <SubmitButton className="self-start mb-4" label={t("submit")} />
      </form>
      <a
        href="https://meshulam.co.il/s/032b9dc6-2281-6b39-0d44-4f7f83d3c586"
        className="font-medium text-pink-600 dark:text-pink-500 underline my-4"
      >
        {t("Paying online for strawberries can be done by clicking this link.")}
      </a>
      <br />
    </main>
  );
}
