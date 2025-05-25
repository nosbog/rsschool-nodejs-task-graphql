import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js"
import { PrismaClient } from "@prisma/client"

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  }
})

const UsersType = new GraphQLList(UserType)

export const UsersTypeSchema = {
  type: UsersType,
  resolve: async (obj, args, context: { prisma: PrismaClient }) => {
    return await context.prisma.user.findMany()
  }
}