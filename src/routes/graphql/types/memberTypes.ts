import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: MemberTypeId.BASIC },
    BUSINESS: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: {
      type: new GraphQLNonNull(MemberIdType),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});
