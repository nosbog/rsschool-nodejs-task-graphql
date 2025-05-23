import { HttpErrors } from '@fastify/sensible';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { GraphQLScalarType } from 'graphql';

export type Context = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  httpErrors: HttpErrors;
};

export interface User {
  id: string;
  name: string;
  balance: number;
  profile: Profile | null;
  posts: Post[];
  userSubscribedTo: User[];
  subscribedToUser: User[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
}

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: MemberType;
}

export interface MemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}
