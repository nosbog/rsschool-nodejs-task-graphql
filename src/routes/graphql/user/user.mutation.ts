import { GraphQLBoolean } from 'graphql';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { UserDto } from './user.model.js';
import {
  ChangeUserInputGQLType,
  CreateUserInputGQLType,
  UserGQLType,
} from './user.type.js';

export const UserMutation = {
  createUser: {
    type: UserGQLType,
    args: { dto: { type: CreateUserInputGQLType } },
    resolve: async (
      _noParent: unknown,
      args: { dto: UserDto },
      context: RequestContext,
    ) => {
      const user = await context.prismaClient.user.create({ data: args.dto });
      return user;
    },
  },

  changeUser: {
    type: UserGQLType,
    args: { id: { type: UUIDType }, dto: { type: ChangeUserInputGQLType } },
    resolve: async (
      _noParent: unknown,
      args: { id: string; dto: UserDto },
      context: RequestContext,
    ) => {
      const user = await context.prismaClient.user.update({
        where: { id: args.id },
        data: args.dto,
      });
      return user;
    },
  },

  deleteUser: {
    type: GraphQLBoolean,
    args: { id: { type: UUIDType } },
    resolve: async (
      _noParent: unknown,
      args: { id: string },
      context: RequestContext,
    ) => {
      try {
        await context.prismaClient.user.delete({ where: { id: args.id } });
        return true;
      } catch {
        return false;
      }
    },
  },

  subscribeTo: {
    type: GraphQLBoolean,
    args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
    resolve: async (
      _noParent: unknown,
      args: { userId: string; authorId: string },
      context: RequestContext,
    ) => {
      try {
        await context.prismaClient.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });

        return true;
      } catch (error) {
        return false;
      }
    },
  },

  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
    resolve: async (
      _noParent: unknown,
      args: { userId: string; authorId: string },
      context: RequestContext,
    ) => {
      try {
        await context.prismaClient.subscribersOnAuthors.deleteMany({
          where: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};
