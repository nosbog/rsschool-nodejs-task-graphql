import { Profile } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GqlContext, UUID } from '../types.js';
import { MemberType } from './MemberType.js';
import { UUIDType } from './UUID.js';
import { UserType } from './User.js';

export const ProfileType: GraphQLObjectType<Profile, GqlContext> = new GraphQLObjectType({
  name: 'Profile',
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
      type: GraphQLString,
    },
    user: {
      type: UserType,
      async resolve(src, _, ctx) {
        return ctx.prisma.user.findUnique({ where: { id: src.userId } });
      },
    },
    memberType: {
      type: MemberType,
      async resolve(src, _, ctx) {
        return ctx.prisma.memberType.findUnique({ where: { id: src.memberTypeId } });
      },
    },
  }),
});

export const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    async resolve(_, args, ctx) {
      return ctx.prisma.profile.findUnique({ where: { id: args.id } });
    },
  },
  profiles: {
    type: new GraphQLList(ProfileType),
    async resolve(_, __, ctx) {
      return ctx.prisma.profile.findMany();
    },
  },
} satisfies {
  profile: GraphQLFieldConfig<void, GqlContext, { id: UUID }>;
  profiles: GraphQLFieldConfig<void, GqlContext>;
};
