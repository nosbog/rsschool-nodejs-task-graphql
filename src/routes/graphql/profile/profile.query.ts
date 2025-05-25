import { GraphQLList } from 'graphql';
import { ProfileGQLType } from './profile.type.js';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';

export const ProfileQuery = {
  profiles: {
    description: 'List of all Profiles',
    type: new GraphQLList(ProfileGQLType),
    resolve: async (_parent: unknown, _args: unknown, context: RequestContext) => {
      const profiles = await context.prismaClient.profile.findMany();
      return profiles;
    },
  },

  profile: {
    type: ProfileGQLType,
    description: 'Get single profile by id',
    args: { id: { type: UUIDType } },
    resolve: async (_parent: unknown, args: { id: string }, context: RequestContext) => {
      const profile = await context.dataLoaders.profile.load(args.id);
      return profile;
    },
  },
};
