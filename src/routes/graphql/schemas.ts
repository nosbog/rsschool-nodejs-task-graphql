import { Type } from '@fastify/type-provider-typebox';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Unknown(),
    errors: Type.Array(
      Type.Object({
        message: Type.String(),
        locations: Type.Optional(
          Type.Array(
            Type.Object({
              line: Type.Number(),
              column: Type.Number(),
            }),
          ),
        ),
        path: Type.Optional(Type.Array(Type.Union([Type.String(), Type.Number()]))),
      }),
    ),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    },
    {
      additionalProperties: false,
    },
  ),
};