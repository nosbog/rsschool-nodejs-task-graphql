import { FastifyInstance } from 'fastify';
import { Profile } from '../types/entityTypes.js';

export const getAllProfiles = async (fastify: FastifyInstance) => {
  const profiles = await fastify.prisma.profile.findMany();
  return profiles;
};

export const getProfile = async (id: string, fastify: FastifyInstance) => {
  const profile = await fastify.prisma.profile.findFirst({
    where: {
      id: id,
    },
  });
  return profile;
};

export const createProfile = async (profile: Profile, fastify: FastifyInstance) => {
  const { isMale, yearOfBirth, userId, memberTypeId } = profile;

  const newProfile = await fastify.prisma.profile.create({
    data: {
      isMale,
      yearOfBirth,
      memberTypeId,
      userId,
    },
  });

  return newProfile;
};

export const updateProfile = async (
  id: string,
  profile: Profile,
  fastify: FastifyInstance,
) => {
  const { isMale, yearOfBirth, userId, memberTypeId } = profile;

  const updatedProfile = await fastify.prisma.profile.update({
    where: {
      id,
    },
    data: {
      isMale,
      yearOfBirth,
      memberTypeId,
      userId,
    },
  });

  return updatedProfile;
};

export const deleteProfile = async (id: string, fastify: FastifyInstance) => {
  await fastify.prisma.profile.delete({
    where: { id },
  });
  return null;
};
