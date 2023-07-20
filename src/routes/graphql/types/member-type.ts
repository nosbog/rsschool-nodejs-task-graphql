// import { Type } from '@fastify/type-provider-typebox';
import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { GraphQLFloat, GraphQLInt, GraphQLNonNull } from 'graphql';
import { User } from './user.js';


export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeId),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },

/*
    user: {
      type: new GraphQLNonNull(User),
      resolve: async ({ userId }, args, context) => {
        return context.prisma.user.findFirst({
          where: {
            id: userId,
          },
        });
      },
    },
*/  
    }),
 
});
