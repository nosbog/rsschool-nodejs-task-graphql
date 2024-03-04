import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { createLoaders } from './dataLoaders.js';

export interface Context {
  prisma: PrismaClient;
  dataLoaders: ReturnType<typeof createLoaders>;
}
