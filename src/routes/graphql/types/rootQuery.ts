import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeIdEnum } from './memberType.js';
import { PostType } from './post.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PrismaClient } from '@prisma/client';
import { memberTypeLoader } from '../dataLoader.js';

const prisma = new PrismaClient();

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (parent, args) => {
        const memberTypes = await prisma.memberType.findMany();
        memberTypes.forEach((memberType) => {
          memberTypeLoader.prime(memberType.id, {
            id: memberType.id,
            discount: memberType.discount,
            postsLimitPerMonth: memberType.postsLimitPerMonth,
          });
        });

        return memberTypes;
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (parent, args: { id: string }) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id: args.id },
        });
        return memberType || { id: args.id, discount: 0, postsLimitPerMonth: 0 };
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, args) => {
        const posts = await prisma.post.findMany();
        return posts;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, args: { id: string }) => {
        const post = await prisma.post.findUnique({
          where: { id: args.id },
        });
        return post;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args) => {
        const users = await prisma.user.findMany();
        return users;
      },
    },
    user: {
      type: new GraphQLNonNull(UserType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, args: { id: string }) => {
        const user = await prisma.user.findUnique({
          where: { id: args.id },
        });
        return user;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args) => {
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (parent, args: { id: string }) => {
        const profile = await prisma.profile.findUnique({
          where: { id: args.id },
        });
        return profile;
      },
    },
  },
});

export { RootQuery };
