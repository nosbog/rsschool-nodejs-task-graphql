import { GraphQLEnumType } from 'graphql';
import { MemberTypeId as MemberTypeIdEnum } from '../../member-types/schemas.js';

const EnumValues = Object.fromEntries(
  Object.entries(MemberTypeIdEnum).map(([, value]) => [value, { value }]),
);

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: EnumValues,
});
