import { GraphQLObjectType } from 'graphql';
import { MemberTypeField, MemberTypesField } from './types/memberType.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: MemberTypeField,
    memberTypes: MemberTypesField,
  },
});
