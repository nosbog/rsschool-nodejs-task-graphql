import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLObjectType, GraphQLSchema } from 'graphql/index.js';
import { MemberTypesQueries } from './member-types/queries.js';
import { UserQueries } from './users/queries.js';
import { UserMutations } from './users/mutations.js';
import { PrismaClient } from '@prisma/client';
import {
  initSubscriptionsToUsersLoader,
  initUsersSubscriptionsLoader,
} from './users/loaders.js';
import { initPostsLoader } from './posts/loaders.js';
import { initProfilesLoader } from './profiles/loaders.js';
import { initMemberTypesLoader } from './member-types/loaders.js';
import { PostQueries } from './posts/queries.js';
import { ProfileQueries } from './profiles/queries.js';
import { PostMutations } from './posts/mutations.js';
import { ProfileMutations } from './profiles/mutations.js';

export function loaders(db: PrismaClient) {
  return {
    subscriptionsToUsersLoader: initSubscriptionsToUsersLoader(db),
    usersSubscriptionsLoader: initUsersSubscriptionsLoader(db),
    postsLoader: initPostsLoader(db),
    profilesLoader: initProfilesLoader(db),
    memberTypesLoader: initMemberTypesLoader(db),
  };
}

export type DataLoaders = ReturnType<typeof loaders>;

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
    handler: async function (request) {
      const { query, variables } = request.body;

      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Query',
          fields: {
            ...UserQueries,
            ...MemberTypesQueries,
            ...PostQueries,
            ...ProfileQueries,
          },
        }),
        mutation: new GraphQLObjectType({
          name: 'Mutation',
          fields: {
            ...UserMutations,
            ...PostMutations,
            ...ProfileMutations,
          },
        }),
      });

      const depthErrors = validate(schema, parse(String(query)), [depthLimit(5)]);

      if (depthErrors.length) {
        return {
          errors: depthErrors,
        };
      }

      return await graphql({
        schema: schema,
        source: String(query),
        variableValues: variables,
        contextValue: { db: prisma, loaders: loaders(prisma) },
      });
    },
  });
};

export default plugin;