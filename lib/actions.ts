"use server";

import { z } from "zod";
import prisma from "./prismadb";
import { getTranslations } from "next-intl/server";
import { currentUser } from "@clerk/nextjs";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function actionForm(
  orderId: string,
  status: Status,
  prevState: any,
  formData: FormData
) {
  const t = await getTranslations("home");
  const errorState = {
    success: false,
    message: t("There was an error. Please try again later."),
  };
  try {
    const products = await prisma.product.findMany();
    const parkingLots = (
      await prisma.parkingLot.findMany({
        select: { id: true },
      })
    ).map(({ id }) => id);
    const schema = z.object({
      name: z.string().min(2).max(20),
      phone: z.string().min(10).max(15),
      ...Object.fromEntries(
        products.map((product) => [
          product.id,
          z.coerce.number().min(product.options[0]).max(product.options[-1]),
        ])
      ),
      parkingLot: z.string().refine((id) => parkingLots.includes(id)),
    });
    const parse = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parse.success) {
      return errorState;
    }
    const user = await currentUser();
    const parkingLotId = formData.get("parkingLot")!.toString();
    const name = formData.get("name")?.toString()!;
    const phone = formData.get("phone")?.toString()!;
    if (user) {
      await prisma.profile.upsert({
        where: { id: user.id },
        update: {
          name,
          phone,
          parkingLotId,
        },
        create: {
          id: user.id,
          name,
          phone,
          parkingLotId,
        },
      });
    }
    const selectedProducts = Array.from(formData.entries())
      .filter(
        ([p, q]) =>
          p !== "parkingLot" &&
          p !== "name" &&
          p !== "phone" &&
          parseInt(q.toString())
      )
      .map(([p, q]) => ({
        quantity: parseInt(q.toString()),
        product: {
          connect: {
            id: p,
          },
        },
      }));
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order) {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          name,
          phone,
          parkingLotId,
          status: status,
          products: {
            deleteMany: {},
            create: selectedProducts,
          },
        },
      });
    }
    return {
      success: true,
      message:
        status === "OPEN"
          ? t("Your order was submitted successfully.")
          : t("Your order was paid successfully."),
    };
  } catch (error) {
    console.log(error);
    return errorState;
  }
}

export async function newOrder() {
  const t = await getTranslations("home");
  const errorState = {
    success: false,
    message: t("There was an error. Please try again later."),
  };
  const user = await currentUser();
  if (!user) {
    return errorState;
  }
  const { id: userId, imageUrl } = user;
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    include: { parkingLot: true },
  });
  const parkingLotId = profile!.parkingLot.id;
  const name = profile!.name;
  const phone = profile!.phone;
  try {
    const order = await prisma.order.findFirst({
      where: { userId, status: "OPEN" },
    });
    if (!order) {
      await prisma.order.create({
        data: {
          userId,
          name,
          imageUrl,
          phone,
          parkingLotId,
          status: "OPEN",
        },
      });
    }
  } catch (error) {
    console.log(error);
    return errorState;
  }
  revalidatePath("/[locale]/order", "page");
  redirect("/[locale]/order");
}
