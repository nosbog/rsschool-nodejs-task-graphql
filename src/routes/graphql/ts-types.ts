import { HttpErrors } from '@fastify/sensible';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { MemberTypeId } from '../member-types/schemas.js';

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
  authorId: string;
}

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
}

export interface MemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export type createUserInputDto = Pick<User, 'balance' | 'name'>;
export type createProfileInputDto = Omit<Profile, 'id'> & { userId: string };
export type createPostInputDto = Omit<Post, 'id'> & { authorId: string };
export type changePostInputDto = Omit<Post, 'id'>;
export type changeProfileInputDto = Omit<Profile, 'id'>;
export type changeUserInputDto = Pick<User, 'balance' | 'name'>;
