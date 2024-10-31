import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyRequest } from 'fastify';
import { ExecutionResult, graphql, parse, Source, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import Schema from './gql-schema/schema.js';
import profilesLoader from './gql-schema/loaders/profilesLoader.js';
import postsLoader from './gql-schema/loaders/postsLoader.js';
import memberTypesLoader from './gql-schema/loaders/memberTypesLoader.js';

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
    async handler(request: FastifyRequest) {
      const { query, variables } = request.body as any;

      const schema = Schema(prisma, profilesLoader(prisma), postsLoader(prisma), memberTypesLoader(prisma));

      const errors = validate(schema, parse(new Source(query)), [depthLimit(MAX_DEPTH)]);

      if (errors.length)
        return { errors } as ExecutionResult;

      return await graphql({
          schema,
          source: query,
          variableValues: variables,
      });
    },
  });
}

export default plugin;
