import { Type } from '@fastify/type-provider-typebox';

export const gqlResponseSchema = Type.Object({
  data: Type.Union([Type.Null(), Type.Record(Type.String(), Type.Any())]),
  errors: Type.Optional(Type.Array(Type.Object({
    message: Type.String(),
    locations: Type.Optional(Type.Array(Type.Object({
      line: Type.Number(),
      column: Type.Number(),
    }))),
    path: Type.Optional(Type.Array(Type.Union([Type.String(), Type.Number()]))),
    extensions: Type.Optional(Type.Record(Type.String(), Type.Any())),
  }))),
});

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
  response: {
    200: gqlResponseSchema,
    400: gqlResponseSchema,
  },
};
