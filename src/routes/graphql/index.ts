import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { memberType, MemberTypeId, post, profile, user } from './types/types.js';
import { FastifyRequest } from 'fastify';
import { UUIDType } from './types/uuid.js';
import { MemberType } from '@prisma/client';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
    },
  });

  const resolveUser = async (args: { id: string }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
    if (!user) return null;
    const profile = await prisma.profile.findUnique({
      where: {
        userId: args.id,
      },
    });
    const posts = await prisma.post.findMany({
      where: {
        authorId: args.id,
      },
    });
    let memberType: MemberType | null = null;
    if (profile) {
      memberType = await prisma.memberType.findUnique({
        where: {
          id: profile?.memberTypeId,
        },
      });
    }
    const userProfile = profile ? { ...profile, memberType } : null;

    const subscriptions = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: args.id,
          },
        },
      },
    });

    const subscribers = await prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: args.id,
          },
        },
      },
    });

    const subscriptionsWithSubscribers = await Promise.all(
      subscriptions.map(async (subscription) => {
        const subscribers2ndLevel = await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: subscription.id,
              },
            },
          },
        });
        return { ...subscription, subscribedToUser: subscribers2ndLevel };
      }),
    );

    const subscribersWithSubscriptions = await Promise.all(
      subscribers.map(async (subscriber) => {
        const subscriptions2ndLevel = await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: subscriber.id,
              },
            },
          },
        });
        return { ...subscriber, userSubscribedTo: subscriptions2ndLevel };
      }),
    );

    const fullUser = {
      ...user,
      profile: userProfile,
      posts,
      userSubscribedTo: subscriptionsWithSubscribers,
      subscribedToUser: subscribersWithSubscriptions,
    };

    return fullUser;
  };

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        memberTypes: {
          type: new GraphQLList(memberType),
          resolve: async () => {
            return prisma.memberType.findMany();
          },
        },
        posts: {
          type: new GraphQLList(post),
          resolve: async () => {
            return prisma.post.findMany();
          },
        },
        users: {
          type: new GraphQLList(user),
          resolve: async () => {
            const prismaUsers = await prisma.user.findMany();
            const users = prismaUsers.map(async (user) => {
              return await resolveUser({ id: user.id });
            });

            return users;
          },
        },
        profiles: {
          type: new GraphQLList(profile),
          resolve: async () => {
            return prisma.profile.findMany();
          },
        },
        memberType: {
          type: memberType,
          args: {
            id: {
              type: MemberTypeId,
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await prisma.memberType.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
        post: {
          type: post,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await prisma.post.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
        user: {
          type: user,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await resolveUser(args);
          },
        },
        profile: {
          type: profile,
          args: {
            id: {
              type: new GraphQLNonNull(UUIDType),
            },
          },
          resolve: async (req: FastifyRequest, args: { id: string }) => {
            return await prisma.profile.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
      },
    }),
  });
};

export default plugin;
