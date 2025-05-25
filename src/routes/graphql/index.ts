import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './schema/graphql-schema.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,

      response: {
        200: gqlResponseSchema,
      },
    },

    async preHandler(req, res) {
      const { query } = req.body;
      const validationRules = [depthLimit(5)];
      const validationErrors = validate(schema, parse(query), validationRules);
      if (validationErrors.length > 0) {
        await res.send({ errors: validationErrors });
      }
    },

    async handler(req) {
      const { query, variables } = req.body;

      const validationRules = [depthLimit(5)];
      const validationErrors = validate(schema, parse(query), validationRules);

      if (validationErrors.length > 0) {
        httpErrors.createError(validationErrors);
        return;
      }

      return graphql({
        schema,
        source: query,

        variableValues: variables,
        contextValue: {
          prisma,
          httpErrors,
        },
      });
    },
  });
};

export default plugin;
