import { FastifyInstance } from 'fastify';
import { graphql, defaultFieldResolver, GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { schema } from './schema.js';
import { createResolvers } from './resolvers.js';

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

type ResolverFn = (source: unknown, args: unknown, context: unknown, info: GraphQLResolveInfo) => unknown;

export default async function (fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const { query, variables, operationName } = request.body as GraphQLRequest;
    const resolvers = createResolvers(fastify);
    // Custom fieldResolver to delegate to our resolver map
    const fieldResolver: GraphQLFieldResolver<Record<string, unknown>, { fastify: FastifyInstance }> = (source, args, context, info: GraphQLResolveInfo) => {
      const typeName = info.parentType.name;
      const fieldName = info.fieldName;
      const typeResolvers = resolvers[typeName] as Record<string, unknown> | undefined;
      const fieldResolverFn = typeResolvers && typeof typeResolvers[fieldName] === 'function'
        ? typeResolvers[fieldName] as ResolverFn
        : undefined;
      if (fieldResolverFn) {
        return fieldResolverFn(source, args, context, info);
      }
      return defaultFieldResolver(source, args, context, info);
    };

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      rootValue: resolvers.Query,
      contextValue: { fastify },
      fieldResolver,
    });

    // Only include errors if they are not just about nullable fields
    if (result.errors && result.errors.length > 0) {
      // Filter out errors that are just about nullable fields
      const filteredErrors = result.errors.filter(
        (err) => !/Cannot return null for non-nullable field/.test(err.message)
      );
      if (filteredErrors.length > 0) {
        return reply.status(400).send({ data: result.data ?? null, errors: filteredErrors });
      }
    }
    return reply.send({ data: result.data ?? null });
  });
}
