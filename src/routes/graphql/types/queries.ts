import { FastifyInstance } from 'fastify';
import {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users,
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: { type: GraphQLString },
    id: { type: GraphQLID },
    balance: { type: GraphQLFloat },
  }),
});

export const users = {
  type: new GraphQLList(UserType),
  resolve: async (context: FastifyInstance) => {
    return await context.prisma.user.findMany();
  },
};

// export const memberType = {
//   type:
// };
