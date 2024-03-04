import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from "graphql";

export const MemberTypeId = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    BASIC: { value: 'basic' },
    BUSINESS: { value: 'business' },
  },
}) 

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: {type:MemberTypeId},
    discount: {
      type: GraphQLFloat
    },
    postsLimitPerMonth: {
      type: GraphQLInt
    },
  }
});