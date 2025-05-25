import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { rootSchema } from './root.schema.js';
import { userDataLoader } from './user/user.dataloader.js';
import { RequestContext } from './types/request-context.js';
import { memberTypeDataLoader } from './member-type/member-type.dataloader.js';
import { profileDataLoader, userProfileDataLoader } from './profile/profile.dataloader.js';
import { postDataLoader, userPostsDataLoader } from './post/post.dataloader.js';

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
      const { query, variables } = req.body;

      const contextValue: RequestContext = {
        prismaClient: fastify.prisma,
        dataLoaders: {
          user: userDataLoader(prisma),
          memberType: memberTypeDataLoader(prisma),
          profile: profileDataLoader(prisma),
          profileByUser: userProfileDataLoader(prisma),
          post: postDataLoader(prisma),
          postsByUser: userPostsDataLoader(prisma),
        },
      };
      const { data, errors } = await graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
        contextValue,
      });

      return { data, errors };
    },
  });
};

export default plugin;
