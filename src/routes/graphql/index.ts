import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { ExecutionResult, graphql, GraphQLSchema, parse, Source, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { createLoaders } from './loaders.ts/create-loaders.js';
import { queryResolver } from './queries/query-resolver.js';
import { mutations } from './mutations/mutations.js';

const MAX_DEPTH = 5;

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
      const { query: queryString, variables } = req.body;

      const loaders = createLoaders(prisma);

      const schema = new GraphQLSchema({
        query: queryResolver(loaders),
        mutation: mutations(prisma),
      });
      try {
        const parsedQuery = parse(new Source(queryString));
        const validationErrors = validate(
          schema,
          parsedQuery,
          [depthLimit(MAX_DEPTH)],
        );

        if (validationErrors.length > 0) {
          return { errors: validationErrors } as ExecutionResult;
        }

        const result = await graphql({
          schema,
          source: queryString,
          variableValues: variables,
          contextValue: { prisma, loaders },
        });

        return result;
      } catch (error) {
        fastify.log.error(error);
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
