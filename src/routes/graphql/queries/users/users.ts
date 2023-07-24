import { GraphQLObjectType, GraphQLFloat, GraphQLList, GraphQLString } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import Context from '../../types/context.js';
import { User } from '@prisma/client';
import profileObjectType from '../profiles/profiles.js';
import postObjectType from '../posts/posts.js';

const userObjectType = new GraphQLObjectType({
  name: 'User',
  description: 'A User',
  fields: () => ({
    id: {
      type: UUIDType,
      description: 'The id',
    },
    name: {
      type: GraphQLString,
      description: 'The name',
    },
    balance: {
      type: GraphQLFloat,
      description: 'The balance',
    },
    profiles: {
      type: profileObjectType,
      description: 'The profiles',
      resolve: async (source: User, _args, context: Context) => {
        return await context.prisma.profile.findMany({
          where: {
            userId: source.id,
          },
        });
      },
    },
    posts: {
      type: postObjectType,
      description: 'The posts',
      resolve: async (source: User, _args: User, context: Context) => {
        return await context.prisma.post.findMany({
          where: {
            authorId: source.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userObjectType),
      description: 'The userSubscribedTo',
      resolve: async (source: User, _args, context: Context) => {
        return await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: source.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userObjectType),
      description: 'The subscribedToUser',
      resolve: async (source: User, _args, context: Context) => {
        return await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: source.id,
              },
            },
          },
        });
      },
    },
  }),
});

const userObjectTypeList = new GraphQLList(userObjectType);

const users = {
  user: {
    type: userObjectType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (_source, args: { id: string }, context: Context) => {
      return await context.prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  users: {
    type: userObjectTypeList,
    resolve: async (_source, _args, context: Context) => {
      return await context.prisma.user.findMany();
    },
  },
};

export { userObjectType, userObjectTypeList as UserObjectTypeList, users };
