import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { FastifyInstance } from 'fastify';
import { MemberTypeId } from './memberType.js';

// ProfileType
export const ProfileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    memberTypeId: {
      type: MemberTypeId,
    },
  }),
});

// ManyProfilesType
export const ManyProfilesType = new GraphQLList(ProfileType);

// Profile args
export interface ProfileTypeArgs {
  id: string;
}
export const profileTypeArgs = { id: { type: UUIDType } };

// Profile resolver
export const profileTypeResolver = async (
  _parent,
  args: ProfileTypeArgs,
  { prisma }: FastifyInstance,
) => {
  return prisma.profile.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many Profiles resolver
export const manyProfileTypeResolver = async (
  _parent,
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.profile.findMany();
};

// ProfileType Field
export const ProfileTypeField = {
  type: ProfileType,
  args: profileTypeArgs,
  resolve: profileTypeResolver,
};

// Many UserType Field
export const ProfilesTypeField = {
  type: ManyProfilesType,
  resolve: manyProfileTypeResolver,
};
