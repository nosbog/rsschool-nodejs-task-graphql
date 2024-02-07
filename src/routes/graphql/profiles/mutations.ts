import {
  ChangeProfileInputType,
  CreateProfileInputType,
  EmptyResponse,
  ProfileType,
} from '../schemas.js';
import { GraphQLInt, GraphQLString, GraphQLID, GraphQLBoolean } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const createProfileMutation = {
  type: ProfileType,
  args: {
    dto: { type: CreateProfileInputType },
  },
  resolve: async (parent, { dto }, context, info) => {
    const newProfile = await context.prisma.profile.create({
      data: dto,
    });

    return newProfile;
  },
};

export const deleteProfileMutation = {
  type: EmptyResponse,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (parent, { id }, context, info) => {
    await context.prisma.profile.delete({
      where: { id },
    });

    return null;
  },
};

export const changeProfileMutation = {
  type: ProfileType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeProfileInputType },
  },
  resolve: async (parent, { id, dto }, context, info) => {
    const updatedProfile = await context.prisma.profile.update({
      where: { id },
      data: dto,
    });

    return updatedProfile;
  },
};
