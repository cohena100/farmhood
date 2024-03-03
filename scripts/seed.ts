import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { title: "Baby cucumbers 🥒400 grams for only ₪10:" },
      {
        title:
          "Strawberries 🍓half a kilo for only ₪25 or 🍓🍓1 kilo for only ₪40:",
      },
      { title: "Sweet organic cherry tomatos 🍅for only ₪25:" },
      {
        title:
          "Foreign-made blueberries 🫐 for only ₪20 or 🫐🫐🫐3 for only ₪50:",
      },
      { title: "Israeli blueberries 🫐for only ₪25:" },
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
