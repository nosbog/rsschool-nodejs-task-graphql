import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {graphql, GraphQLSchema} from 'graphql';

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
      const query = req.body.query;
      const variables = req.body.variables;
      // const context = Context {
      //   prisma,
      //       ...fetchers(prisma),
      // };
      console.log(query);
      console.log(variables);
      return graphql( {
         schema: createGqlResponseSchema,
         variables.query,
         variables,
         context,
      });
    },
  });
};

// export const schema = new GraphQLSchema( {
//     query: ,
//         // mutation: Mutations,
// });
export default plugin;
