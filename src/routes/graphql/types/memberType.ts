import { GraphQLInt, GraphQLFloat, GraphQLEnumType, GraphQLObjectType } from 'graphql';
  
export const MemberTypeIdType = new GraphQLEnumType({
    name: 'MemberTypeIdType',
    values: {
        basic: { value: 'basic' },
        business: { value: 'business' },
    },
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: { type: MemberTypeIdType },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
    }),
});
  