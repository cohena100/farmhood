import { PrismaClient, Status } from "@prisma/client";
import * as R from "remeda";

const prisma = new PrismaClient();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
async function main() {
  const products = await prisma.product.findMany();
  const parkingLots = await prisma.parkingLot.findMany();
  const users = [
    {
      name: "אילנה אביטל",
      phone: "0521234567",
      password: "",
      parkingLotId: parkingLots[getRandomInt(parkingLots.length)].id,
    },
    // {
    //   name: "גידי גוב",
    //   phone: "0521234567",
    //   password: "",
    //   parkingLotId: parkingLots[getRandomInt(parkingLots.length)].id,
    // },
    // {
    //   name: "שלמה ארצי",
    //   phone: "0521234567",
    //   password: "",
    //   parkingLotId: parkingLots[getRandomInt(parkingLots.length)].id,
    // },
    {
      name: "יהודית רביץ",
      phone: "0521234567",
      password: "",
      parkingLotId: parkingLots[getRandomInt(parkingLots.length)].id,
    },
    {
      name: "עפרה חזה",
      phone: "0521234567",
      password: "",
      parkingLotId: parkingLots[getRandomInt(parkingLots.length)].id,
    },
  ];
  users.forEach(async (user, i) => {
    // await prisma.user.create({
    //   data: {
    //     id: i.toString(),
    //     username: i.toString(),
    //     password: user.password,
    //   },
    // });
    // await prisma.profile.create({
    //   data: {
    //     id: i.toString(),
    //     name: user.name,
    //     phone: user.phone,
    //     parkingLotId: user.parkingLotId,
    //   },
    // });
    const selectedProducts = R.sample(
      products,
      getRandomInt(products.length) + 1,
    ).map((product) => ({
      quantity: getRandomInt(product.options.length),
      product: {
        connect: {
          id: product.id,
        },
      },
    }));
    await prisma.order.create({
      data: {
        userId: i.toString(),
        name: user.name,
        phone: user.phone,
        parkingLotId: user.parkingLotId,
        status: Status.PAID,
        products: {
          create: selectedProducts,
        },
      },
    });
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
