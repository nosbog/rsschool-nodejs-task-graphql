import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js"
import { PrismaClient } from "@prisma/client"

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  }
})

const PostsType = new GraphQLList(PostType)

export const PostsTypeSchema = {
  type: PostsType,
  resolve: async (obj, args, context: { prisma: PrismaClient }) => {
    return await context.prisma.post.findMany()
  }
}