import { ProfileType } from '../schemas.js';
import { GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { getProfileWithMemberType, getProfilesWithMemberType } from './helpers.js';

export const profilesQuery = {
  type: new GraphQLList(ProfileType),
  resolve: async (parent, args, context, info) => {
    return getProfilesWithMemberType(context.prisma);
  },
};

export const profileQuery = {
  type: ProfileType,
  args: { id: { type: UUIDType } },
  resolve: async (parent, { id }, context, info) => {
    return getProfileWithMemberType(context.prisma, { id });
  },
};
