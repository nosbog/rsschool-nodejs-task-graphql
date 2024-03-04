import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

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
      const { query, variables } = req.body;

      const queryDoc = parse(query)

      const validationErrors = validate(gqlSchema, queryDoc, [depthLimit(5)])

      if (validationErrors?.length) {
        return { data: '', errors: validationErrors }
      }

      const { data, errors } = await graphql({
        variableValues: variables,
        source: query,
        schema: gqlSchema,
      });

      return { data, errors }
    },
  });
};

export default plugin;
