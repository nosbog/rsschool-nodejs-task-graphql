import { PrismaClient } from '@prisma/client';
import { getDataLoaders } from '../dataLoaders/dataLoaders.js';

export interface Context {
  prisma: PrismaClient;
  dataLoaders: ReturnType<typeof getDataLoaders>;
}
