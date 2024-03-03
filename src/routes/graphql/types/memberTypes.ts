import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ProfileType } from '../schemas.js';

enum MemberTypeIdValue {
  BASIC = 'basic',
  BUSINESS = 'business',
}

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeIdValue.BASIC]: { value: MemberTypeIdValue.BASIC },
    [MemberTypeIdValue.BUSINESS]: { value: MemberTypeIdValue.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
