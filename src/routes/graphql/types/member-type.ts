// import { Type } from '@fastify/type-provider-typebox';
import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { GraphQLFloat, GraphQLInt, GraphQLNonNull } from 'graphql';


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
    discount  : {
      type: new GraphQLNonNull(GraphQLFloat),
    },  
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },

    }),
 
});
