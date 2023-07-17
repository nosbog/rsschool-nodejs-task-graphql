import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { getQueryType } from './schema/resolvers/query.js';
import { getDataLoaders } from './util/getDataLoaders.js';
import { getMutationType } from './schema/resolvers/mutation.js';
import validateDepth from './util/validations.js';

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
    async handler(req, res) {
      const schema: GraphQLSchema = new GraphQLSchema({
        query: await getQueryType(fastify),
        mutation: await getMutationType(fastify),
      });

      const validationErrors = validateDepth(schema, req.body.query);

      if (validationErrors.length > 0) {
        return await res.send({ data: null, errors: validationErrors });
      }

      return await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          fastify,
          dataLoader: getDataLoaders(fastify),
        },
      });
    },
  });
};

export default plugin;
