import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from './uuid.js';

import { Context } from '../context.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BASIC },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberType: {
      type: MemberType,
      resolve: async (parent, _args, { dataLoaders }: Context) => {
        return dataLoaders.membersLoader.load(parent.MemberTypeId);
      },
    },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (parent, _args, { dataLoaders }: Context) => {
        return dataLoaders.profilesLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (parent, _args, { dataLoaders }: Context) => {
        return dataLoaders.postsLoader.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _args, { dataLoaders }: Context) => {
        return dataLoaders.userSubLoader.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _args, { dataLoaders }: Context) => {
        return dataLoaders.userSubscribedTo.load(parent.id);
      },
    },
  }),
});

export const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: {
    subscriber: { type: UserType },
    subscriberId: { type: UUIDType },
    author: { type: UserType },
    authorId: { type: UUIDType },
  },
});
