import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './schema.js';
import depthLimit from 'graphql-depth-limit';
import { createDataLoaders } from './dataloader.js';

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
        // Parse the query
        const document = parse(query);
        
        // Validate with depth limiting
        const validationErrors = validate(schema, document, [depthLimit(5)]);
        
        if (validationErrors.length > 0) {
          return {
            errors: validationErrors.map(error => ({
              message: error.message,
              locations: error.locations,
            })),
          };
        }
        
        // Create fresh DataLoaders for each request
        const dataLoaders = createDataLoaders(prisma);
        
        // Execute the query if validation passes
        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: {
            fastify,
            prisma,
            dataLoaders,
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