import { getTranslations } from "next-intl/server";
import { Label, Radio, TextInput } from "flowbite-react";
import prisma from "@/lib/prismadb";
import { SubmitButton } from "./submit-button";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) notFound();
  const { id } = user;
  const products = await prisma.product.findMany();
  const selection = Object.fromEntries(
    products.map((product) => [product.id, 0])
  );
  const order = await prisma.order.findUnique({
    where: { id },
    include: { products: true },
  });
  if (order && order.products) {
    for (const p of order.products) {
      selection[p.productId] = p.quantity;
    }
  }
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { parkingLot: true },
  });
  const parkingLots = await prisma.parkingLot.findMany();
  const parkingLot = profile ? profile.parkingLot : parkingLots[0];
  const name = profile?.name;
  const phone = profile?.phone;
  const t = await getTranslations("home");
  return (
    <main className="flex flex-col ms-2">
      <form action="" className="flex flex-col mt-2 gap-8">
        <div>
          <Label htmlFor="name" value={t("First name and last name")} />
          <TextInput
            id="name"
            name="name"
            type="text"
            className="max-w-screen-sm"
            defaultValue={name}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" value={t("Phone number")} />
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            defaultValue={phone}
            required
            className="max-w-screen-sm"
          />
        </div>
        {products.map((product) => (
          <fieldset key={product.id} className="flex gap-8">
            <legend className="mb-2">
              <Label>{t(product.title)}</Label>
            </legend>
            <div className="flex gap-4 flex-wrap">
              {product.options.map((v, i) => (
                <div key={product.id + i} className="flex items-center gap-2">
                  <Radio
                    id={product.id + i}
                    name={product.id}
                    value={v}
                    defaultChecked={selection[product.id] === v}
                  />
                  <Label htmlFor={product.id + i}>{v}</Label>
                </div>
              ))}
            </div>
          </fieldset>
        ))}
        <fieldset className="flex gap-8">
          <legend className="mb-2">
            <Label>{t("Collection place")}</Label>
          </legend>
          {parkingLots.map((p, i) => (
            <div key={p.id + i} className="flex items-center gap-2">
              <Radio
                id={p.id + i}
                name="parkingLot"
                value={p.id}
                defaultChecked={parkingLot.id === p.id}
              />
              <Label htmlFor={p.id + i}>{t(p.name)}</Label>
            </div>
          ))}
        </fieldset>
        <SubmitButton className="self-start mb-4" label={t("Submit")} />
      </form>
      <a
        href="https://meshulam.co.il/s/032b9dc6-2281-6b39-0d44-4f7f83d3c586"
        className="font-medium text-pink-600 dark:text-pink-500 underline my-4"
      >
        {t(
          "Paying online for strawberries 🍓🍓can be done by clicking this link."
        )}
      </a>
      <Label
        className="my-4"
        value={t(
          "I will arrive on Tuesday around 17:30 at Hershko 8 and then on the public parking space at Yuval Neeman."
        )}
      />
    </main>
  );
}
