import { PrismaClient } from '@prisma/client';
import { UUID as CryptoUUID } from 'crypto';

export type UUID = CryptoUUID;

export type Member = {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type Profile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

export type Subscribe = {
  subscriberId: string;
  authorId: string;
};

export type User = {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo?: Subscribe[];
  subscribedToUser?: Subscribe[];
};

/* Graphql specific */

export type GqlContext = {
  prisma: PrismaClient;
};
