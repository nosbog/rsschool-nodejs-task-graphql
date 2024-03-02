import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schemas.js';
import { Context } from 'vm';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  // const { prisma } = fastify;
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
      // const contextValue: Context = { prisma };
      console.log(req.body.variables);
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: fastify,
      });
    },
  });
};

export default plugin;
