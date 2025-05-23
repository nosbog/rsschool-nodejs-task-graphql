import {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';
import { Context, MemberType } from '../ts-types.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'Allowed MemberTypeId for Member Types',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberTypeType = new GraphQLObjectType<MemberType, Context>({
  name: 'MemberType',
  description: 'Represents a member type',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});
