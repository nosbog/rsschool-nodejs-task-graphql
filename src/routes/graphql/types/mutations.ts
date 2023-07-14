import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserType } from './queries.js';
import { FastifyInstance } from 'fastify';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser,
  }),
});

export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const createUser = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) },
  },
  resolve: async (_source: any, args: { input: any }, context: FastifyInstance) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await context.prisma.user.create(args.input);
  },
};
