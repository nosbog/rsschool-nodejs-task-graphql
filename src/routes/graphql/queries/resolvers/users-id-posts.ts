import { PrismaClient } from '@prisma/client';

interface UsersIdArgs {
  userId : string;
}

export const usersIdPostsResolver = async (
  { userId  }: UsersIdArgs,
  prisma: PrismaClient,
  ) => await prisma.memberType.findUnique({where: { id: userId  }});