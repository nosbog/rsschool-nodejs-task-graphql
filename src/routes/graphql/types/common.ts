import { PrismaClient } from '@prisma/client';

export interface Context {
  prisma: PrismaClient;
}

export interface ID {
  id: string;
}