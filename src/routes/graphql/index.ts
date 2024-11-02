import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';

const schema = new GraphQLSchema({
  // query: ?
  // mutation:
});

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
      const { query: source, variables: variableValues } = req.body;

      const schema = new GraphQLSchema({
        // query:
        // mutation
      });

      console.log('==================================================================');
      console.log(req.body);
      console.log('==================================================================');

      return graphql({
        schema,
        source,
        variableValues,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
