import { GraphQLBoolean } from 'graphql';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileDto } from './profile.model.js';
import {
  ChangeProfileInputGQLType,
  CreateProfileInputGQLType,
  ProfileGQLType,
} from './profile.type.js';

export const ProfileMutation = {
  createProfile: {
    type: ProfileGQLType,
    args: { dto: { type: CreateProfileInputGQLType } },
    resolve: async (
      _noParent: unknown,
      args: { dto: ProfileDto },
      context: RequestContext,
    ) => {
      const profile = await context.prismaClient.profile.create({ data: args.dto });
      return profile;
    },
  },

  changeProfile: {
    type: ProfileGQLType,
    args: { id: { type: UUIDType }, dto: { type: ChangeProfileInputGQLType } },
    resolve: async (
      _noParent: unknown,
      args: { id: string; dto: ProfileDto },
      context: RequestContext,
    ) => {
      const profile = await context.prismaClient.profile.update({
        where: { id: args.id },
        data: args.dto,
      });
      return profile;
    },
  },

  deleteProfile: {
    type: GraphQLBoolean,
    args: { id: { type: UUIDType } },
    resolve: async (
      _noParent: unknown,
      args: { id: string },
      context: RequestContext,
    ) => {
      try {
        await context.prismaClient.profile.delete({ where: { id: args.id } });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
