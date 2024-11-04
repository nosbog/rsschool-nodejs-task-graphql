import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
  }),
});

export const post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    title: {
      type: UUIDType,
    },
    content: {
      type: UUIDType,
    },
    authorId: {
      type: UUIDType,
    },
  }),
});

export const user = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: UUIDType,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: profile,
    },
    posts: {
      type: new GraphQLList(post),
    },
    userSubscribedTo: {
      type: new GraphQLList(userSubscribedTo),
    },
    subscribedToUser: {
      type: new GraphQLList(subscribedToUser),
    },
  }),
});

export const profile = new GraphQLObjectType({
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
    memberType: {
      type: memberType,
    },
  }),
});

export const MemberTypeId = new GraphQLScalarType({
  name: 'MemberTypeId',
});

export const userSubscribedTo = new GraphQLObjectType({
  name: 'userSubscribedTo',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: UUIDType,
    },
    balance: {
      type: GraphQLFloat,
    },
    subscribedToUser: {
      type: new GraphQLList(subscribedToUser),
    },
  }),
});

export const subscribedToUser = new GraphQLObjectType({
  name: 'subscribedToUser',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: UUIDType,
    },
    balance: {
      type: GraphQLFloat,
    },
    userSubscribedTo: {
      type: new GraphQLList(userSubscribedTo),
    },
  }),
});

export type SubscriptionType = {
  id: string;
  name: string;
  balance: number;
};

export interface Subscriber {
  id: string;
  name: string;
  balance: number;
  subscribedToUser: SubscriptionType[];
}

export interface Subscription {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo: SubscriptionType[];
}
