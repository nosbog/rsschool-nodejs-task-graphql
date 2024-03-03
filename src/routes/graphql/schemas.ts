import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberTypeQueries } from './types/MemberType.js';
import { PostQueries } from './types/Post.js';
import { ProfileQueries } from './types/Profile.js';
import { UserQueries } from './types/User.js';

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

export const gqlRootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...MemberTypeQueries,
      ...PostQueries,
      ...ProfileQueries,
      ...UserQueries,
    },
  }),
});
