import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.role.createMany({
    data: [
        {
            name: 'ADMIN'
        },
        {
            name: 'USER'
        }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });

  //seeds is to create data in the database,inserting initial data into a database, when the database is first created. 