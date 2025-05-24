import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLEnumType, GraphQLFloat } from 'graphql';

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(IdType) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const IdType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: { value: 'BASIC' },
        BUSINESS: { value: 'BUSINESS' },
    }
})
