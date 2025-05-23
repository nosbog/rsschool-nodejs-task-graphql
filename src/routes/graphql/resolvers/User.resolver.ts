import { Context } from '../ts-types.js';

export const getAllUsers = async (
  _parent: unknown,
  _args: unknown,
  { prisma }: Context,
) => {
  return prisma.user.findMany();
};

export const getUser = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma, httpErrors }: Context,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (user === null) {
    throw httpErrors.notFound();
  }
  return user;
};
