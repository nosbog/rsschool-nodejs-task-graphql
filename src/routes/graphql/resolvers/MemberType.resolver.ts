import { Context, Profile } from '../ts-types.js';

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
  { prisma }: Context,
) => {
  const memberType = await prisma.memberType.findUnique({
    where: {
      id,
    },
  });
  return memberType;
};

export const getMemberTypeByProfile = async (
  parent: Profile,
  _args: unknown,
  { prisma }: Context,
) => {
  const { memberTypeId } = parent;
  const profile = await prisma.memberType.findUnique({
    where: {
      id: memberTypeId,
    },
  });
  return profile;
};
