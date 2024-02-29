import { GraphQLList, GraphQLObjectType } from 'graphql';
import { Context, MemberType } from './types/types.js';

export const RootQuery = new GraphQLObjectType<unknown, Context>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_obj, _args, ctx: Context) => {
        return ctx.prisma.memberType.findMany();
      },
    },
  },
});
