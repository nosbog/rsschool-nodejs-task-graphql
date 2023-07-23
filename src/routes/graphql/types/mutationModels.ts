import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberTypeIdEnum } from "./models.js";


export const createPost = new GraphQLInputObjectType({
  name: 'createPostInput',
  fields: ()=>({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: {type: UUIDType }
  })
})

export const createProfile = new GraphQLInputObjectType({
  name: 'createProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: {type: MemberTypeIdEnum},
    userId: {type: UUIDType},
  })
})

export const createUser = new GraphQLInputObjectType({
  name: 'createUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  })
})

export const updatePost = new GraphQLInputObjectType({
  name: 'updatePostInput',
  fields: ()=>({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  })
})

export const updateProfile = new GraphQLInputObjectType({
  name: 'updateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: {type: MemberTypeIdEnum},
  })
})

export const updateUser = new GraphQLInputObjectType({
  name: 'updateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  })
})

export const createUserSubscribeTo = new GraphQLInputObjectType({
  name: 'createUserSubscribeToInput',
  fields: () => ({
    authorId: { type: UUIDType },
  })
})