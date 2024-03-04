/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UserType } from './userType.ts';

export const Mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType, 
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args, context) => {
       
        const newUser = await context.prisma.user.create({
          data: {
           
            username: args.username,
           
          },
        });
        return newUser;
      },
    },
  },
});

export default Mutations;
