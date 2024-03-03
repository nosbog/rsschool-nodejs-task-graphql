import { GraphQLBoolean } from 'graphql';
import { ProfileType } from '../../models/profile.js';
import { Context } from '../../types/context.js';
import { UUIDType } from '../../types/uuid.js';
import {
  ChangeProfileDto,
  ChangeProfileInput,
  CreateProfileDto,
  CreateProfileInput,
} from './profileDto.js';

export const profileMutations = {
  createProfile: {
    type: ProfileType,
    args: { dto: { type: CreateProfileInput } },
    resolve: async (
      _,
      args: {
        dto: CreateProfileDto;
      },
      context: Context,
    ) => {
      const profile = await context.prisma.profile.create({
        data: args.dto,
      });

      return profile;
    },
  },
  changeProfile: {
    type: ProfileType,
    args: {
      id: { type: UUIDType },
      dto: { type: ChangeProfileInput },
    },
    resolve: async (
      _,
      args: {
        id: string;
        dto: ChangeProfileDto;
      },
      context: Context,
    ) => {
      const profile = await context.prisma.profile.update({
        where: { id: args.id },
        data: args.dto,
      });

      return profile;
    },
  },
  deleteProfile: {
    type: GraphQLBoolean,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, args: { id: string }, context: Context) => {
      await context.prisma.profile.delete({
        where: { id: args.id },
      });
    },
  },
};
