import { GraphQLBoolean } from 'graphql';
import { UserType } from '../../models/user.js';
import { Context } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';
import {
  ChangeUserDto,
  ChangeUserInput,
  CreateUserDto,
  CreateUserInput,
} from './userDto.js';

export const userMutations = {
  createUser: {
    type: UserType,
    args: {
      dto: {
        type: CreateUserInput,
      },
    },
    resolve: async (_, args: { dto: CreateUserDto }, context: Context) => {
      const user = await context.prisma.user.create({
        data: args.dto,
      });

      return user;
    },
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, args: { id: string }, context: Context) => {
      await context.prisma.user.delete({
        where: { id: args.id },
      });
    },
  },
  changeUser: {
    type: UserType,
    args: {
      id: { type: UUIDType },
      dto: {
        type: ChangeUserInput,
      },
    },
    resolve: async (_, args: { id: string; dto: ChangeUserDto }, context: Context) => {
      const user = await context.prisma.user.update({
        where: { id: args.id },
        data: args.dto,
      });

      return user;
    },
  },
  subscribeTo: {
    type: UserType,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      _,
      args: {
        userId: string;
        authorId: string;
      },
      context: Context,
    ) => {
      const subscription = await context.prisma.subscribersOnAuthors.create({
        data: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      });

      return subscription;
    },
  },
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      _,
      args: {
        userId: string;
        authorId: string;
      },
      context: Context,
    ) => {
      await context.prisma.subscribersOnAuthors.deleteMany({
        where: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      });

      return true;
    },
  },
};
