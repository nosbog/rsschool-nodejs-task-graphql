import {
  changeProfileInputDto,
  Context,
  createProfileInputDto,
} from '../ts-types.js';

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

export const createProfile = async (
  _parent: unknown,
  { dto }: { dto: createProfileInputDto },
  { prisma }: Context,
) => {
  const profile = await prisma.profile.create({
    data: dto,
  });
  return profile;
};

export const updateProfile = async (
  _parent: unknown,
  { dto, id }: { dto: changeProfileInputDto; id: string },
  { prisma }: Context,
) => {
  const profile = await prisma.profile.update({
    where: {
      id,
    },
    data: dto,
  });
  return profile;
};

export const deleteProfile = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma }: Context,
) => {
  await prisma.profile.delete({ where: { id } });
  return 'Deleted succesfully!';
};
