import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './schema.js';
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
      const { query, variables } = req.body;
      
      try {
        const document = parse(query);
        
        const validationErrors = validate(schema, document, [depthLimit(5)]);
        
        if (validationErrors.length > 0) {
          return {
            errors: validationErrors.map(error => ({
              message: error.message,
              locations: error.locations,
            })),
          };
        }

        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: {
            fastify,
            prisma,
          },
        });
        
        return result;
      } catch (error) {
        return {
          errors: [{
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            locations: [],
          }],
        };
      }
    },
  });
};

export default plugin;