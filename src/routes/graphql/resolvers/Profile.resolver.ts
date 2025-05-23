import { Context } from '../ts-types.js';

export const getAllProfiles = async (
  _parent: unknown,
  _args: unknown,
  { prisma }: Context,
) => {
  return prisma.profile.findMany();
};

export const getProfile = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma, httpErrors }: Context,
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id,
    },
  });
  if (profile === null) {
    throw httpErrors.notFound();
  }
  return profile;
};
