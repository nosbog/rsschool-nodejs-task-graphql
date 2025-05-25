import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql"
import { ContextType } from "./general.js"

type MemberId = 'BUISNESS' | 'BASIC'

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
    postsLimitPerMonth: { type: GraphQLInt }
  }
})

export const MemberTypes = new GraphQLList(MemberType)

export const MemberTypesSchema = {
  type: MemberTypes,
  resolve: async (obj, args, context: ContextType) => {
    return await context.prisma.memberType.findMany()
  }
}

type MemberTypeSchemaArgs = { id: MemberId }

export const MemberTypeSchema = {
  type: MemberType,
  args: {
    id: { type: MemberTypeId }
  },
  resolve: async (obj, args: MemberTypeSchemaArgs, context: ContextType) => {
    if (args.id) {
      return await context.prisma.memberType.findFirst({
        where: { id: args.id }
      })
    }
    return null
  }
}