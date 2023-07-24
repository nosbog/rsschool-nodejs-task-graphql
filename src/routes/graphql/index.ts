import 'graphql-import-node';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse, buildASTSchema } from 'graphql';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as rawSchema from './schema.graphql';
import { resolve, dirname } from 'node:path';

const root = {
  users: (a, b, c) => {
    console.log(a, b, c);

    return 'kek';
  },
};

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
      const parsedQuery = parse(query);
      const schema = buildASTSchema(rawSchema);

      const errors = validate(schema, parsedQuery);

      if (errors.length) {
        return {
          errors,
        };
      }

      const executionResult = await graphql({
        schema: schema,
        source: query,
        rootValue: root,
        variableValues: variables,
        contextValue: {
          prisma,
        },
      });

      return {
        data: executionResult.data,
        errors: executionResult.errors,
      };
    },
  });
};

export default plugin;
