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
