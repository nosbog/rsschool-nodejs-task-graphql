import { PrismaClient } from '@prisma/client';

export const usersResolver = async (prisma: PrismaClient) => await prisma.post.findMany();