import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberTypeId } from "./member-types.js";

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { 
      type: UUIDType
    },
    isMale: {
      type: GraphQLBoolean
    },
    yearOfBirth: {
      type: GraphQLInt
    },
    userId: {
      type: UUIDType
    },
    memberTypeId: {type: MemberTypeId},
  }
});