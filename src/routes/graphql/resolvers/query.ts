import { GraphQLNonNull, getNullableType } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLObjectType } from 'graphql';
import { httpErrors } from '@fastify/sensible';
import { MemberType, MemberTypeId } from '../types/member-types.js';
import { PostType } from '../types/posts.js';
import { ProfileType } from '../types/profiles.js';
import { UserType } from '../types/users.js';
import { UUIDType } from '../types/uuid.js';

export const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_, { id }, prisma: PrismaClient) => {
        return prisma.memberType.findMany();
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (_, { id }, prisma: PrismaClient) => {
        return prisma.post.findMany();
      }
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_, { id }, prisma: PrismaClient) => {
        return prisma.profile.findMany();
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_, { id }, prisma: PrismaClient) => {
        return prisma.user.findMany();
      }
    },
    memberType: {
      type: getNullableType(MemberType),
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_, { id }, prisma: PrismaClient) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id },
        });
        if (memberType === null) {
          throw httpErrors.notFound();
        }
        return memberType;
      }
    },
    post: {
      type: getNullableType(PostType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, prisma: PrismaClient) => {
        const post = await prisma.post.findUnique({
          where: { id },
        });
        if (post === null) {
          throw httpErrors.notFound();
        }
        return post;
      }
    },
    profile: {
      type: getNullableType(ProfileType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, prisma: PrismaClient) => {
        const profile = await prisma.profile.findUnique({
          where: { id },
        });
        if (profile === null) {
          throw httpErrors.notFound();
        }
        return profile;
      }
    },
    user: {
      type: getNullableType(UserType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, prisma: PrismaClient) => {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (user === null) {
          throw httpErrors.notFound();
        }
        return user;
      }
    },
  }
})
