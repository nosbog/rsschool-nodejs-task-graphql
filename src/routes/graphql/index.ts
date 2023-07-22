import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { buildSchema, graphql } from 'graphql';

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
      const schemaSDL = `
        type Query {
          hello: String
        }
    `;

      const schema = buildSchema(schemaSDL);
      const { query, variables } = req.body;
      const result = await graphql({ schema, source: query, variableValues: variables });

      console.log(result);
      return result;
    },
  });
};

export default plugin;
