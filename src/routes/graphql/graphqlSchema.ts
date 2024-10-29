import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberIdType, MemberType } from './types/memberTypes.js';
import { User } from './types/users.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { UUIDType } from './types/uuid.js';
import { Post } from './types/posts.js';

interface IncludeFieldsPrisma {
  userSubscribedTo?: boolean;
  subscribedToUser?: boolean;
}

const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_obj, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberIdType) } },
      resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_obj, _args, { prisma }, info) => {
        const parsedResolveInfo = parseResolveInfo(info);
        const fields = parsedResolveInfo?.fieldsByTypeName.User;
        const include: IncludeFieldsPrisma = {};
        if (fields && 'userSubscribedTo' in fields) {
          include.userSubscribedTo = true;
        }
        if (fields && 'subscribedToUser' in fields) {
          include.subscribedToUser = true;
        }

        return await prisma.user.findMany({
          include,
        });
      },
    },

    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: (_obj, _args, { prisma }) => {
        return prisma.post.findMany();
      },
    },

    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, { prisma }) => {
        return await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: Mutations
});

export { schema };
