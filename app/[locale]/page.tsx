import { getTranslations } from "next-intl/server";
import { Label, Radio, TextInput, Tooltip } from "flowbite-react";
import prisma from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { FormButtons } from "./form-buttons";
import { NewOrderButton } from "./new-order-button";

export default async function Home() {
  const user = await currentUser();
  if (!user) notFound();
  const { id: userId } = user;
  const products = await prisma.product.findMany();
  const selection = Object.fromEntries(
    products.map((product) => [product.id, 0])
  );
  let order = await prisma.order.findFirst({
    where: { userId, status: "OPEN" },
    include: { products: true },
  });
  if (!order) {
    order = await prisma.order.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
      where: { userId, status: "PAID" },
      include: { products: true },
      take: 1,
    });
  }
  if (order) {
    for (const p of order.products) {
      selection[p.productId] = p.quantity;
    }
  }
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    include: { parkingLot: true },
  });
  const parkingLots = await prisma.parkingLot.findMany();
  const parkingLot = profile ? profile.parkingLot : parkingLots[0];
  const name = profile?.name;
  const phone = profile?.phone;
  const t = await getTranslations("home");
  return (
    <main className="flex flex-col ms-4">
      <form>
        <fieldset
          disabled={order?.status === "PAID"}
          className="flex flex-col mt-2 gap-8"
        >
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
            <div key={product.id} className="flex flex-col gap-2">
              <Label>{t(product.title)}</Label>
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
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <Label>{t("Collection place")}</Label>
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
          </div>
          {(!order || order?.status === "OPEN") && (
            <Tooltip
              content={t(
                "The buttons along with the alert are the only client componets of this page. The rest are server side rendered."
              )}
            >
              <FormButtons />
            </Tooltip>
          )}
        </fieldset>
      </form>
      {order?.status === "PAID" && (
        <NewOrderButton message={t("Your order was paid successfully.")} />
      )}
      <Label
        className="my-4"
        value={t(
          "I will arrive on Tuesday around 17:30 at Weizmann 12 and then on the public parking space at Gordon 9."
        )}
      />
    </main>
  );
}
