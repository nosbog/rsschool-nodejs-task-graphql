import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeType, MemberTypeId } from './memberType.js';
import { Context, Profile } from '../ts-types.js';
import { getMemberTypeByProfile } from '../resolvers/MemberType.resolver.js';

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  description: 'Represents a profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: { type: MemberTypeType, resolve: getMemberTypeByProfile },
    userId: { type: UUIDType },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  description: 'Input type for modifying a profile',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    MemberTypeId: {
      type: MemberTypeId,
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  description: 'Input type for adding a profile',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    MemberTypeId: {
      type: MemberTypeId,
    },
    userId: { type: UUIDType },
  }),
});
