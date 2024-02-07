import {
  ChangeUserInputType,
  CreateUserInputType,
  EmptyResponse,
  UserType,
} from '../schemas.js';
import { GraphQLString, GraphQLID } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const createUserMutation = {
  type: UserType,
  args: {
    dto: { type: CreateUserInputType },
  },
  resolve: async (parent, { dto }, context, info) => {
    const newUser = await context.prisma.user.create({
      data: dto,
    });

    return newUser;
  },
};

export const deleteUserMutation = {
  type: EmptyResponse,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (parent, { id }, context, info) => {
    await context.prisma.user.delete({
      where: { id },
    });

    return null;
  },
};

export const changeUserMutation = {
  type: UserType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeUserInputType },
  },
  resolve: async (parent, { id, dto }, context, info) => {
    const updatedUser = await context.prisma.user.update({
      where: { id },
      data: dto,
    });

    return updatedUser;
  },
};

export const subscribeToMutation = {
  type: UserType,
  args: {
    userId: { type: UUIDType },
    authorId: { type: UUIDType },
  },
  resolve: async (parent, { userId, authorId }, context, info) => {
    return await context.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId: authorId,
          },
        },
      },
    });
  },
};

export const unsubscribeFromMutation = {
  type: EmptyResponse,
  args: {
    userId: { type: UUIDType },
    authorId: { type: UUIDType },
  },
  resolve: async (parent, { userId, authorId }, context, info) => {
    await context.prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId: authorId,
        },
      },
    });
    return null;
  },
};
