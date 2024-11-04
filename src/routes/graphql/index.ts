import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
      const { variables, query } = req.body;

      const validationRules = [depthLimit(5)];

      const errors = validate(schema, parse(query), validationRules);

      return !errors.length
        ? graphql({
            schema,
            source: query,
            variableValues: variables,
          })
        : { errors };
    },
  });
};

export default plugin;
