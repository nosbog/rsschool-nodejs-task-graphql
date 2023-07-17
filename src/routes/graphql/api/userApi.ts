import { FastifyInstance } from 'fastify';
import { Profile, User } from '../types/entityTypes.js';

export const getAllUsers = async (fastify: FastifyInstance) => {
  const users = await fastify.prisma.user.findMany();
  return users;
};

export const getUser = async (id: string, fastify: FastifyInstance) => {
  const user = await fastify.prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  return user;
};

export const createUser = async (user: User, fastify: FastifyInstance) => {
  const { name, balance } = user;
  const newUser = await fastify.prisma.user.create({
    data: {
      name,
      balance,
    },
  });

  return newUser;
};

export const updateUser = async (id: string, user: User, fastify: FastifyInstance) => {
  const updatedUser = await fastify.prisma.user.update({
    where: { id },
    data: {
      name: user?.name,
      balance: user?.balance,
    },
  });

  return updatedUser;
};
export const deleteUser = async (id: string, fastify: FastifyInstance) => {
  await fastify.prisma.user.delete({
    where: { id },
  });
  return null;
};

export const subscribeTo = async (
  id: string,
  subscribeToUserId: string,
  fastify: FastifyInstance,
) => {
  const subscribedUser = await fastify.prisma.user.update({
    where: { id },
    data: {
      userSubscribedTo: {
        create: {
          authorId: subscribeToUserId,
        },
      },
    },
  });

  return subscribedUser;
};

export const unsubscribeFrom = async (
  id: string,
  unsubscribeFromUserId: string,
  fastify: FastifyInstance,
) => {
  await fastify.prisma.user.update({
    where: { id },
    data: {
      userSubscribedTo: {
        deleteMany: {
          authorId: unsubscribeFromUserId,
        },
      },
    },
  });

  return null;
};
