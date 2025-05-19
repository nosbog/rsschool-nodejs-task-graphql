import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat, 
  GraphQLInt,
  GraphQLEnumType,
} from "graphql";


export type MemberTypeId = 'BASIC' | 'BUSINESS';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: 'BASIC'
    },
    BUSINESS: {
      value: 'BUSINESS'
    }
  }
})

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(memberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});