import { Static, Type } from '@fastify/type-provider-typebox';
import { RootQuery } from './rootQuery.js';
import { GraphQLSchema } from 'graphql';
import {  rootMutation } from './rootMutaions.js';

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

export const schema = new GraphQLSchema({
  query: RootQuery, 
  mutation: rootMutation,
});
const profileFields = {
  id: Type.String({format: 'uuid'}),
  isMale: Type.Boolean(),
  yearOfBirth: Type.Integer(),
  userId: Type.String(),
  memberTypeId: Type.String(),
}

const userFields = {
  id: Type.String({format: 'uuid'}),
  name: Type.String(),
  balance: Type.Number()
}

export const postFields = {
  id: Type.String({format: 'uuid'}),
  title: Type.String(),
  content: Type.String(),
  authorId: Type.String({format: 'uuid'}), // ?? ,
}

export const ProfileSchema = Type.Object({...profileFields});

export const UserSchema = Type.Object({...userFields});

export const PostSchema = Type.Object({...postFields});

export type ProfileBody = Static<typeof ProfileSchema>
export type UserBody = Static<typeof UserSchema>
export type PostBody = Static<typeof PostSchema>
