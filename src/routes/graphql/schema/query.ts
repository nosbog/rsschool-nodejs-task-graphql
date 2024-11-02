import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PrismaContext } from '../types/context.js';
import { MemberType, MemberIdEnum } from '../types/member.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../types/profile.js';

interface MemberTypeArgs {
  id: string;
}

interface GetPostArgsType {
  id: string;
}

// interface PostsArgsType {
//   id: string;
// }

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (obj, args, { prisma }: PrismaContext) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: {
        id: { type: new GraphQLNonNull(MemberIdEnum) },
      },
      resolve: async (obj, { id }: MemberTypeArgs, { prisma }: PrismaContext) => {
        return await prisma.memberType.findUnique({
          where: {
            id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (obj, args, { prisma }: PrismaContext) => {
        return await prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (obj, { id }: GetPostArgsType, { prisma }: PrismaContext) => {
        return await prisma.post.findUnique({
          where: {
            id,
          },
        });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (obj, args, { prisma }: PrismaContext) => {},
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (obj, args, { prisma }: PrismaContext) => {},
    },
  },
});
