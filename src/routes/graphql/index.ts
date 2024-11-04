import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema,  schema } from './schemas.js';
import { graphql } from 'graphql';
import { Type } from '@fastify/type-provider-typebox';

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
      return graphql(
        {
          schema,
          source: req.body.query,
          variableValues: req.body.variables
        }
      );
    },
  });

  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        query: Type.String(), // GraphQL query string passed via query parameter
        variables: Type.Optional(Type.String()) // Optional JSON string for variables
      }),
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const { query, variables } = req.query;

      // Если переменные передаются в виде строки, их нужно преобразовать в объект
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedVariables = variables ? JSON.parse(variables) : undefined;

      return graphql({
        schema,
        source: query,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        variableValues: parsedVariables
      });
    },
  });
  
};
// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'rootQuery',
//   fields: {
//     testString: {
//       type: GraphQLString,
//       resolve: async () => {
//         return 'hello there'
//       }
//     }
//   }}),
// })

export default plugin;
