import { getTranslations } from "next-intl/server";
import { Label, Radio, TextInput, Tooltip } from "flowbite-react";
import prisma from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { FormButtons } from "@/components/form-buttons";
import { NewOrderButton } from "@/components/new-order-button";
import { Prisma, Status } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function Home() {
  let order: Prisma.OrderGetPayload<{
    include: { products: true };
  }> | null;
  const parkingLots = await prisma.parkingLot.findMany();
  const user = await currentUser();
  const profile = user
    ? await prisma.profile.findUnique({
        where: { id: user.id },
        include: { parkingLot: true },
      })
    : null;
  const parkingLot = profile ? profile.parkingLot : parkingLots[0];
  const name = profile?.name ?? "";
  const phone = profile?.phone ?? "";
  const imageUrl = user?.imageUrl ?? "";
  if (!user) {
    order = await prisma.order.create({
      data: {
        name,
        imageUrl,
        phone,
        parkingLotId: parkingLot.id,
        status: Status.OPEN,
        products: {
          create: [],
        },
      },
      include: { products: true },
    });
  } else {
    order = await prisma.order.findFirst({
      where: { userId: user.id, status: Status.OPEN },
      include: { products: true },
    });
    if (!order) {
      order = await prisma.order.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
        where: { userId: user.id, status: Status.PAID },
        include: { products: true },
        take: 1,
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
    <main className="flex flex-col ms-4">
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
