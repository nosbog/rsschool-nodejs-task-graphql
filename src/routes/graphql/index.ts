import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { Query } from './query/query.js';
import { Mutation } from './mutations/mutations.js';

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
        query: Query,
        mutation: Mutation,
      });

      const { query, variables } = req.body;

      const { data } = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
      });

      return { data };
    },
  });
};

export default plugin;
