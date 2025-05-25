import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';
import { createResolvers } from './resolvers.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const resolvers = createResolvers(fastify);

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

      return await graphql({
        schema,
        source: query,
        rootValue: resolvers,
        variableValues: variables
      })
    },
  });
};

export default plugin;
