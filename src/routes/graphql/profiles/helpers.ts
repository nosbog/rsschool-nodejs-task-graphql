import { getMemberType } from '../member-types/helpers.js';

export const getProfileWithMemberType = async (prisma, where) => {
  const profile = await prisma.profile.findUnique({
    where,
    include: {
      memberType: true,
    },
  });

  if (!profile) {
    return null;
  }

  return profile;
};

export const getProfilesWithMemberType = async (prisma) => {
  const profiles = await prisma.profile.findMany({
    include: {
      memberType: true,
    },
  });

  return profiles;
};
