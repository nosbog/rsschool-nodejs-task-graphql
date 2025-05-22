import { PrismaClient } from '@prisma/client';

export const profilesResolver = async (prisma: PrismaClient) => await prisma.post.findMany();