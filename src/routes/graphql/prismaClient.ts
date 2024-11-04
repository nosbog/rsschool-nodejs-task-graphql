import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
      userSubscribedTo: {
        include: {
          author: true,
        },
      },
    },
  });
  console.log(users);
}
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

export { prisma };
