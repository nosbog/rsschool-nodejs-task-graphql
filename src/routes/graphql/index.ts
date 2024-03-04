/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { RootQuery } from './types/rootQuery.ts';
import { Mutations } from './types/mutations.ts';
import { MemberTypeBody, PostBody, ProfileBody, getLoader } from './getLoader.ts';

interface GqlRequestBody {
  query?: string;
  variables?: Record<string, unknown>;
}

interface Context {
  prisma: PrismaClient;
  loaders: {
    postLoader: DataLoader<string, PostBody[] | null>;
    profileLoader: DataLoader<string, ProfileBody>;
    memberTypeLoader: DataLoader<string, MemberTypeBody>;
  };
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const loaders = getLoader(prisma);

  const context: Context = {
    prisma,
    ...getLoader(prisma),
    loaders: {
      postLoader: loaders.postLoader,
      profileLoader: loaders.profileLoader,
      memberTypeLoader: loaders.memberTypeLoader,
    },
  };

  fastify.route({
    url: '/',
    method: ['POST'],
    schema: {
      ...createGqlResponseSchema,
      response: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        200: gqlResponseSchema,
      },
    },
    async handler(request, _) {
      const requestBody: GqlRequestBody = request.body || {};
      const { query = '', variables = {} }: GqlRequestBody = requestBody;

      try {
        const queryDocument = parse(query);
        const errors = validate(schema, queryDocument, [depthLimit(5)]);
        if (errors.length > 0) {
          return { errors };
        }

        const result = await graphql({
          schema: schema,
          source: query,
          variableValues: variables,
          contextValue: context,
        });

        return result;
      } catch (error) {
        console.error('GraphQL error:', error);
        throw new Error('Internal server error');
      }
    },
  });
};

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});

export default plugin;
