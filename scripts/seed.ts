import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { title: "baby cucubers", measure: "GRAM", unit: 400 },
      { title: "strawberries", measure: "GRAM", unit: 500 },
      { title: "cherry tomato", measure: "BOX", unit: 1 },
      { title: "foreign-made blueberries", measure: "BOX", unit: 1 },
      { title: "israeli blueberries", measure: "BOX", unit: 1 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
