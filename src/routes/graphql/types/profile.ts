import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql"
import { UUIDType } from "./uuid.js"
import { MemberType } from "./member.js"
import { ContextType, GetResByIdResolverArgs } from "./general.js"

const Profile = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: { type: MemberType }
  }
})

const Profiles = new GraphQLList(Profile)

export const ProfilesSchema = {
  type: Profiles,
  resolve: async (obj, args, context: ContextType) => {
    return await context.prisma.profile.findMany()
  }
}

export const ProfileSchema = {
  type: Profile,
  args: {
    id: { type: UUIDType }
  },
  resolve: async (obj, args: GetResByIdResolverArgs, context: ContextType) => {
    if (args.id) {
      return await context.prisma.profile.findFirst({
        where: { id: args.id }
      })
    }
    return null
  }
}