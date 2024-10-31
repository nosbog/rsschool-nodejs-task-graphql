import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from './uuid.js';
import { PrismaClient } from "@prisma/client";

export const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  })
});

export const PostQuery = new GraphQLObjectType({
  name: "PostQuery",
  fields: () => ({
    posts: {
      type: new GraphQLList(PostType),
      resolve: (source, args, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.post.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: (source, { id }: { id: string; }, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.post.findUnique({ where: { id } });
      }
    },
  })
});