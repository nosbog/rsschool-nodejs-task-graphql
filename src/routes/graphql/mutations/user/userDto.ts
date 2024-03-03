import { Static } from '@fastify/type-provider-typebox';
import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from 'graphql';
import { createUserSchema } from '../../../users/schemas.js';

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export type CreateUserDto = Static<(typeof createUserSchema)['body']>;

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export type ChangeUserDto = Static<(typeof createUserSchema)['body']>;
