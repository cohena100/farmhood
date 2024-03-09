"use server";

import { z } from "zod";
import prisma from "./prismadb";
import { getTranslations } from "next-intl/server";
import { currentUser } from "@clerk/nextjs";

export async function submitForm(prevState: any, formData: FormData) {
  const t = await getTranslations("home");
  const errorState = {
    success: false,
    message: t("There was an error. Please try again later."),
  };
  const user = await currentUser();
  if (!user) {
    return errorState;
  }
  try {
    const products = await prisma.product.findMany();
    const parkingLots = (
      await prisma.parkingLot.findMany({
        select: { id: true },
      })
    ).map(({ id }) => id);
    const schema = z.object({
      ...Object.fromEntries(
        products.map((product) => [product.id, z.coerce.number().min(0).max(3)])
      ),
      parkingLot: z.string().refine((id) => parkingLots.includes(id)),
    });
    const parse = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parse.success) {
      return errorState;
    }
    const { id, firstName, lastName, imageUrl, emailAddresses = [] } = user;
    await prisma.order.delete({ where: { id } }).catch(() => {});
    const parkingLotId = formData.get("parkingLot")?.toString() ?? "";
    await prisma.profile.upsert({
      where: { id },
      update: { parkingLotId },
      create: {
        id,
        parkingLotId,
      },
    });
    await prisma.order.create({
      data: {
        id,
        firstName,
        lastName,
        imageUrl,
        emailAddresses: emailAddresses.map((email) => email.emailAddress),
        parkingLotId,
        products: {
          create: Array.from(formData.entries())
            .filter(([p, q]) => p !== "parkingLot" && parseInt(q.toString()))
            .map(([p, q]) => ({
              quantity: parseInt(q.toString()),
              product: {
                connect: {
                  id: p,
                },
              },
            })),
        },
      },
    });
    return {
      success: true,
      message: t("Your order was submitted successfully."),
    };
  } catch (error) {
    console.log(error);
    return errorState;
  }
}
