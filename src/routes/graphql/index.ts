import { FastifyInstance } from 'fastify';
import { graphql, GraphQLError, GraphQLResolveInfo } from 'graphql';
import { schema } from './schema.js';
import { resolvers } from './resolvers.js';

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

type ResolverFn = (source: unknown, args: unknown, context: unknown, info: GraphQLResolveInfo) => unknown;

type ResolverMap = {
  Query: Record<string, ResolverFn>;
  Mutation: Record<string, ResolverFn>;
};

function flattenResolvers(resolverMap: ResolverMap): Record<string, ResolverFn> {
  return { ...resolverMap.Query, ...resolverMap.Mutation };
}

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: GraphQLRequest }>('/', async (request, reply) => {
    const { query, variables } = request.body;
    const resolverMap = resolvers(fastify) as ResolverMap;
    const rootValue = flattenResolvers(resolverMap);

    try {
      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        rootValue,
        contextValue: { fastify },
      });

      if (result.errors) {
        return reply.code(400).send({
          data: null,
          errors: result.errors.map((error) => ({
            message: error.message,
            locations: error.locations,
            path: error.path,
          })),
        });
      }

      return reply.send({
        data: result.data || {},
        errors: null,
      });
    } catch (error) {
      if (error instanceof GraphQLError) {
        return reply.code(400).send({
          data: null,
          errors: [{
            message: error.message,
            locations: error.locations,
            path: error.path,
          }],
        });
      }

      throw error;
    }
  });
}
