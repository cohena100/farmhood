"use server";

import { z } from "zod";
import prismadb from "./prismadb";
import { getTranslations } from "next-intl/server";

export async function submitForm(prevState: any, formData: FormData) {
  const t = await getTranslations("home");
  const products = await prismadb.product.findMany();
  const s = Object.fromEntries(
    products.map((product) => [product.id, z.coerce.number().min(0).max(3)])
  );
  const schema = z.object(s);
  const parse = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parse.success) {
    return {
      success: false,
      message: t("There was an error. Please try again later."),
    };
  }
  await new Promise((res) => setTimeout(res, 2000));
  return {
    success: true,
    message: t("Your order was submitted successfully."),
  };
}
