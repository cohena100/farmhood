import { getTranslations } from "next-intl/server";
import { Label, Radio, TextInput, Tooltip } from "flowbite-react";
import prisma from "@/lib/prismadb";
import { FormButtons } from "@/components/form-buttons";
import { NewOrderButton } from "@/components/new-order-button";
import { Status } from "@prisma/client";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProductSelect from "@/components/product-select";

export default async function Home() {
  const user = { id: "", imageUrl: null };
  const parkingLots = await prisma.parkingLot.findMany();
  const profile =
    user &&
    (await prisma.profile.findUnique({
      where: { id: user.id },
      include: { parkingLot: true },
    }));
  const parkingLotId =
    profile?.parkingLot.id ||
    cookies().get("parkingLotId")?.value ||
    parkingLots[0].id;
  const name = profile?.name || cookies().get("name")?.value || "";
  const phone = profile?.phone || cookies().get("phone")?.value || "";
  const imageUrl = user?.imageUrl ?? "";
  const orderId = cookies().get("order")?.value;
  let order =
    orderId &&
    (await prisma.order.findUnique({
      where: { id: orderId },
      include: { products: true },
    }));
  if (!order) {
    if (user) {
      order =
        (await prisma.order.findFirst({
          where: { userId: user.id, status: Status.OPEN },
          include: { products: true },
        })) ||
        (await prisma.order.findFirst({
          orderBy: {
            updatedAt: "desc",
          },
          where: { userId: user.id, status: Status.PAID },
          include: { products: true },
          take: 1,
        }));
    } else {
      order = await prisma.order.create({
        data: {
          name,
          imageUrl,
          phone,
          parkingLotId,
          status: Status.OPEN,
          products: {
            create: [],
          },
        },
        include: { products: true },
      });
    }
  }
  if (!order) notFound();
  const products = await prisma.product.findMany();
  const selection = Object.fromEntries(
    products.map((product) => [product.id, 0])
  );
  for (const p of order.products) {
    selection[p.productId] = p.quantity;
  }
  const t = await getTranslations("home");
  return (
    <main className="flex flex-col ms-4 invisible">
      <form>
        <fieldset
          disabled={order.status === Status.PAID}
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
            <ProductSelect
              key={product.id}
              product={product}
              selection={selection[product.id]}
            />
          ))}
          <div className="flex flex-col gap-2">
            <Label>{t("Collection place")}</Label>
            {parkingLots.map((p, i) => (
              <div key={p.id + i} className="flex items-center gap-2">
                <Radio
                  id={p.id + i}
                  name="parkingLot"
                  value={p.id}
                  defaultChecked={parkingLotId === p.id}
                />
                <Label htmlFor={p.id + i}>{t(p.name)}</Label>
              </div>
            ))}
          </div>
          {order.status === Status.OPEN && (
            <Tooltip
              content={t(
                "The buttons along with the alert are the only client componets of this page. The rest are server side rendered."
              )}
            >
              <FormButtons orderId={order.id} />
            </Tooltip>
          )}
        </fieldset>
      </form>
      {order.status === Status.PAID && (
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
