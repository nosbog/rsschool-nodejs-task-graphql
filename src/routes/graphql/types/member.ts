import { PrismaClient } from "@prisma/client"
import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    'BASIC': { value: 'BASIC' },
    'BUISNESS': { value: 'BUISNESS' }
  }
})

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    test: { type: GraphQLString }
  }
})

export const MembersType = new GraphQLList(MemberType)

export const MembersTypeSchema = {
  type: MembersType,
  resolve: async (obj, args, context: { prisma: PrismaClient }) => {
    return await context.prisma.memberType.findMany()
  }
}