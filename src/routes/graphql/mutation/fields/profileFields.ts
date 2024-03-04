import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ChangeProfile, CreateProfile, ID } from '../../types/common.js';
import { UUIDType } from '../../types/uuid.js';
import { ProfileType, CreateProfileInputType, ChangeProfileInputType } from '../../types/profile.js';

export const profileFields = {
  createProfile: {
    type: ProfileType,
    args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
    resolve: async (source, { dto }: CreateProfile, { prisma }) =>
      await prisma.profile.create({ data: dto }),
  },

  changeProfile: {
    type: ProfileType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
    },
    resolve: async (source, { id, dto }: ChangeProfile, { prisma }) =>
      prisma.profile.update({ where: { id }, data: dto }),
  },

  deleteProfile: {
    type: GraphQLBoolean,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (source, { id }: ID, { prisma }) =>
      !!(await prisma.profile.delete({ where: { id } })),
  },
};