import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { queryType } from './rootQuery.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
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
      const schema = new GraphQLSchema({
        query: queryType,
      });
      const { data } = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
      return { data };
    },
  });
};

export default plugin;
