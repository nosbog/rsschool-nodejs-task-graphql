import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { schema } from './graphqlSchema.js';
import depthLimit from 'graphql-depth-limit';
import {
  createMemberTypeLoader,
  createPostLoader,
  createProfileLoader,
  createUserLoader,
} from './data-loaders.js';

const DEPTH_LIMIT = 5;

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
    async handler(req) {
      const { query, variables } = req.body;
      try {
        const queryDocument = parse(query);
        const errors = validate(schema, queryDocument, [depthLimit(DEPTH_LIMIT)]);
        if (errors.length) {
          return { errors, prisma };
        }

        const res = await graphql({
          schema,
          source: query,
          contextValue: {
            prisma,
            httpErrors,
            userLoader: createUserLoader(prisma),
            memberTypeLoader: createMemberTypeLoader(prisma),
            postLoader: createPostLoader(prisma),
            profileLoader: createProfileLoader(prisma),
          },
          variableValues: variables,
        });

        return res;
      } catch (err) {
        return { errors: err, prisma };
      }
    },
  });
};

export default plugin;
