import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { queries } from './queriesShemas.js';
import { mutations } from './mutations.js';

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

      const queriesShema = new GraphQLSchema({
           query: queries,
           mutation: mutations
      });

      const res = await graphql({
        schema: queriesShema,
        source: String(req.body.query),
        contextValue: fastify,
        variableValues: req.body.variables,
      });
      return res;
      //{data: res.data}
    },
  });
};

export default plugin;
