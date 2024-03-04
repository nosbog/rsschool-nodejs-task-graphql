import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PostQueries } from './posts/query.js';
import { PostMutations } from './posts/mutation.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...PostQueries,
  }),
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...PostMutations,
  }),
});

export const gqlSchema = new GraphQLSchema({ query, mutation });