import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './userType.ts';


export const RootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (_, __, context) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const users = await context.loaders.userLoader.loadAll();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return users;
      },
    },
  },
});