import { Context } from '../ts-types.js';

export const getAllMemberTypes = async (
  _parent: unknown,
  _args: unknown,
  { prisma }: Context,
) => {
  return prisma.memberType.findMany();
};

export const getMemberType = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma, httpErrors }: Context,
) => {
  const memberType = await prisma.memberType.findUnique({
    where: {
      id,
    },
  });
  if (memberType === null) {
    throw httpErrors.notFound();
  }
  return memberType;
};
