import { GraphQLList } from 'graphql';
import { ProfileType } from '../models/profile.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';

export const profileResolvers = {
  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_, _args, context: Context) => {
      const profiles = await context.prisma.profile.findMany();

      return profiles;
    },
  },
  profile: {
    type: ProfileType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_, args: { id: string }, context: Context) => {
      const profile = await context.prisma.profile.findUnique({
        where: { id: args.id },
      });

      return profile;
    },
  },
};
