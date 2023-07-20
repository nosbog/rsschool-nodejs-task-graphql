import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { FastifyInstance } from 'fastify';
import { ProfileType } from './profile.js';
import { ManyPostsType } from './post.js';

// UserType
export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: subscribedToUserResolver,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: userSubscribedToResolver,
    },
    profile: {
      type: ProfileType,
      resolve: userProfileResolver,
    },
    posts: {
      type: ManyPostsType,
      resolve: userPostResolver,
    },
  }),
});

// ManyUsersType
export const ManyUsersType = new GraphQLList(UserType);

// User args
export interface UserTypeArgs {
  id: string;
}
export const userTypeArgs = { id: { type: UUIDType } };

// User resolver
export const userTypeResolver = async (
  _parent,
  args: UserTypeArgs,
  { prisma }: FastifyInstance,
) => {
  return await prisma.user.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many Users resolver
export const manyUserTypesResolver = async (
  _parent,
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.user.findMany();
};

// subscribedToUser resolver
export const subscribedToUserResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: parent.id,
        },
      },
    },
  });
};

// userSubscribedTo resolver
export const userSubscribedToResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: parent.id,
        },
      },
    },
  });
};

// Profile resolver
export const userProfileResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.profile.findUnique({ where: { userId: parent.id } });
};

// Post Resolver
export const userPostResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.post.findMany({ where: { authorId: parent.id } });
};

// UserType Field
export const UserTypeField = {
  type: UserType,
  args: userTypeArgs,
  resolve: userTypeResolver,
};

// Many UserType Field
export const UsersTypeField = {
  type: ManyUsersType,
  resolve: manyUserTypesResolver,
};
