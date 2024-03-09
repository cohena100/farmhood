import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { title: "Baby cucumbers 🥒400 grams for ₪10" },
      {
        title: "Strawberries 🍓half a kilo for ₪25 or 🍓🍓1 kilo for ₪40",
      },
      { title: "Sweet organic cherry tomatos 🍅for ₪25" },
      {
        title: "Foreign-made blueberries 🫐 for ₪20 or 🫐🫐🫐3 for ₪50",
      },
      { title: "Israeli blueberries 🫐for ₪25" },
    ],
  });
  await prisma.parkingLot.createMany({
    data: [{ name: "Hershko 8" }, { name: "Yuval Naaman 9 parking lot" }],
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
