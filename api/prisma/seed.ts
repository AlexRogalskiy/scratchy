import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { setPassword } from "~/app/user/entities/user.entity";

const prisma = new PrismaClient();

async function main() {
  const jason = await prisma.user.upsert({
    where: { email: "jason@raimondi.us" },
    update: {},
    create: {
      id: "4ba51f0d-3301-484d-b702-655db0e67e62",
      firstName: "Jason",
      lastName: "Raimondi",
      email: "jason@raimondi.us",
      isEmailConfirmed: true,
      createdIP: "127.0.0.1",
      passwordHash: await setPassword("jasonraimondi"),
      roles: {
        create: [
          {
            role: {
              connectOrCreate: {
                where: { name: "overlord" },
                create: { name: "overlord" }
              }
            }
          }
        ]
      }
    }
  });
  console.log(jason);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });