import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js"
import { ContextType, GetResByIdResolverArgs } from "./general.js"

const Post = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  }
})

const Posts = new GraphQLList(Post)

export const PostsSchema = {
  type: Posts,
  resolve: async (obj, args, context: ContextType) => {
    return await context.prisma.post.findMany()
  }
}

export const PostSchema = {
  type: Post,
  args: {
    id: { type: UUIDType }
  },
  resolve: async (obj, args: GetResByIdResolverArgs, context: ContextType) => {
    if (args.id) {
      return await context.prisma.post.findFirst({
        where: { id: args.id }
      })
    }
    return null
  }
}