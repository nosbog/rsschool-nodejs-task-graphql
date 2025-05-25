import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js"
import { ContextType, GetResByIdResolverArgs } from "./general.js"

const User = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  }
})

const Users = new GraphQLList(User)

export const UsersSchema = {
  type: Users,
  resolve: async (obj, args, context: ContextType) => {
    return await context.prisma.user.findMany()
  }
}

export const UserSchema = {
  type: User,
  args: {
    id: { type: UUIDType }
  },
  resolve: async (obj, args: GetResByIdResolverArgs, context: ContextType) => {
    if (args.id) {
      return await context.prisma.user.findFirst({
        where: { id: args.id }
      })
    }
    return null
  }
}