import { FastifyInstance } from 'fastify';

const getUsers = async ({ prisma }: FastifyInstance) => {
  return await prisma.user.findMany();
};

const getUserById = async (id: string, { prisma }: FastifyInstance) => {
  return await prisma.user.findFirst({ where: { id } });
};

export { getUsers, getUserById };
