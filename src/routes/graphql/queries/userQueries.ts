import { FastifyInstance } from 'fastify';
import { GraphQLList } from 'graphql';

import { UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';
import { getUserById, getUsers } from '../actions/userActions.js';

export const userQueries = {
  user: {
    type: UserType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: (_source, { id }, context: FastifyInstance) => getUserById(id, context),
  },
  users: {
    type: new GraphQLList(UserType),
    resolve: (_source, _args, context: FastifyInstance) => getUsers(context),
  },
};
