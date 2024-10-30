import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyRequest } from 'fastify';
import { graphql } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import Schema from './gql-schema/schema.js';
import profileLoader from './gql-schema/loaders/profileLoader.js';
import postsLoader from './gql-schema/loaders/postsLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const schema = Schema(prisma, profileLoader(prisma), postsLoader(prisma));

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request: FastifyRequest) {
      const { query, variables } = request.body as any;
      return await graphql({
          schema,
          source: query,
          rootValue: root,
          variableValues: variables,
      });
    },
  });
}

export default plugin;
