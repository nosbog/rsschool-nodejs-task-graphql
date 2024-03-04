import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';


interface GqlRequestBody {
  query?: string;
  variables?: Record<string, unknown>;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: ['POST'],
    schema: {
      ...createGqlResponseSchema,
      response: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        200: gqlResponseSchema,
      },
    },
    async handler(request, _) {
      const { query, variables }: GqlRequestBody = request.body;

      try {
        const result = await graphql({
          schema: schema, 
          source: query, 
          variableValues: variables, 
          contextValue: { prisma }, 
           
        });
        const errors = validate(schema, parse(query), [depthLimit(5)]);
        if (errors.length > 0) {
          return { errors }
        } else {
          return result;
        }

      } catch (error) {
        console.error('GraphQL error:', error);
        throw new Error('Internal server error');
      }
    },
  });
};

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations
})

export default plugin;