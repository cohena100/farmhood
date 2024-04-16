import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title:
          "Strawberries 🍓🍓 1 kilo for ₪40 (packed in half kilo portions)",
        options: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        title: "Israeli blueberries 🫐 1 for ₪25 or 🫐🫐🫐 3 for ₪55",
        options: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        title: "Foreign-made blueberries 🫐 1 for ₪20 or 🫐🫐🫐 3 for ₪50",
        options: [0, 1, 2, 3],
      },
      {
        title: "Cherry Loblo tomatoes 🍅 small basket for ₪25",
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
  });
  await prisma.parkingLot.createMany({
    data: [{ name: "Weizmann 12" }, { name: "Gordon 9 parking lot" }],
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
