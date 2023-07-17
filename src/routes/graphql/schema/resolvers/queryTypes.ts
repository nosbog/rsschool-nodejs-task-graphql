import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { ContextType } from '../../types/contextType.js';
import { Profile, User } from '../../types/entityTypes.js';
import { MemberType } from '@prisma/client';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const GraphQLMemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const GraphQLPostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const GraphQLProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (profile: Profile, _, { dataLoader }: ContextType) => {
        const memberTypes = await dataLoader.getProfileMemberType.load(
          profile.memberTypeId,
        );

        return (memberTypes[0] as MemberType) || null;
      },
    },
  }),
});

export const GraphQLUserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: GraphQLProfileType,
      resolve: async (user: User, _, { dataLoader }: ContextType) => {
        const profiles = await dataLoader.getUserProfilesLoader.load(user.id);

        return (profiles[0] as Profile) || null;
      },
    },
    posts: {
      type: new GraphQLList(GraphQLPostType),
      resolve: (user: User, _, { dataLoader }: ContextType) => {
        return dataLoader.getUserPostsLoader.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUserType),
      resolve: (user: User, _, { dataLoader }: ContextType) => {
        return dataLoader.getUserSubscribedTo.load(user.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUserType),
      resolve: (user: User, _, { dataLoader }: ContextType) => {
        return dataLoader.getUserSubscribedToUser.load(user.id);
      },
    },
  }),
});
