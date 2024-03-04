import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import { Query } from './query/query.js';
import { Mutation } from './mutations/mutations.js';
import depthLimit from 'graphql-depth-limit';

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
      const schema = new GraphQLSchema({
        query: Query,
        mutation: Mutation,
      });

      const { query, variables } = req.body;
      const maxDepth = 5;

      const validatedErrors = validate(schema, parse(query), [depthLimit(maxDepth)]);

      if (validatedErrors.length) {
        return { errors: validatedErrors };
      }

      const { data, errors } = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
      });

      return { data, errors };
    },
  });
};

export default plugin;
