import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql"
import { UUIDType } from "./uuid.js"
import { MemberType } from "./member.js"
import { PrismaClient } from "@prisma/client"

const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: { type: MemberType }
  }
})

const ProfilesType = new GraphQLList(ProfileType)

export const ProfilesTypeSchema = {
  type: ProfilesType,
  resolve: async (obj, args, context: { prisma: PrismaClient }) => {
    return await context.prisma.profile.findMany()
  }
}