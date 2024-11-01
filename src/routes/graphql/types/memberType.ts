import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLEnumType } from 'graphql';

const MemberTypeIdEnum = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    BASIC: { value: "BASIC" },
    BUSINESS: { value: "BUSINESS" }
  }
});

export const MemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt }
  }),
});