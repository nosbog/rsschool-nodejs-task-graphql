import { GraphQLInt, GraphQLFloat, GraphQLEnumType, GraphQLObjectType } from 'graphql';
  
export const MemberTypeIdType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: { value: 'BASIC' },
        BUSINESS: { value: 'BUSINESS' },
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
  