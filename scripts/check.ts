import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const products = await prisma.product.findMany();
  // const selection = Object.fromEntries(
  //   products.map((product) => [product.id, 0])
  // );
  // const order = await prisma.order.findUnique({
  //   where: { id: "user_2cwkL0VUgBxHlJLZWOck84CgHG2" },
  //   include: { products: true },
  // });
  // if (order && order.products) {
  //   for (const p of order.products) {
  //     selection[p.productId] = p.quantity;
  //   }
  // }
  // console.log(selection);
  const id = undefined;
  // const orders = await prisma.order.findMany({
  //   where: { parkingLotId: id },
  //   include: { products: { include: { product: true } }, parkingLot: true },
  // });
  // console.log(orders);
  // const order = await prisma.order
  //   .findUnique({
  //     where: { id },
  //     include: { products: { include: { product: true } }, parkingLot: true },
  //   })
  //   .catch(() => undefined);
  // console.log(order);
  // const orders = await prisma.order.findMany({
  //   include: {
  //     _count: {
  //       select: { products: true },
  //     },
  //   },
  // });
  // const result = await prisma.user.findMany({
  //   where: {
  //     posts: {
  //       some: {
  //         views: {
  //           gt: 10,
  //         },
  //       },
  //     },
  //   },
  // })
  const orders = await prisma.order.findMany({
    where: {
      products: {
        some: {
          quantity: {
            gt: 4,
          },
        },
      },
    },
  });
  console.log(JSON.stringify(orders));
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
