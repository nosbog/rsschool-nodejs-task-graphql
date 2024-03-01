import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLEnumType } from "graphql";
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from "./uuid.js";
import { getLoaders } from "./loaders.js";
import { UserBody } from "../schemas.js";

const memberTypeFields = {
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  };
  
  export const MemberType = new GraphQLObjectType({
    name: 'MemberType', 
    fields: memberTypeFields,
  });

  const profileTypeFields = {
    id: { type: UUIDType},
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  };
  
  export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType', 
    fields: profileTypeFields,
  });

  const postTypeFields = {
    id: { type:  UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  };
  
  export const PostType = new GraphQLObjectType({
    name: 'PostType', 
    fields: postTypeFields,
  });

const userTypeFields = {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
        type: ProfileType,
        resolve: async (user: UserBody, _, ctx: Context) => {
            return await ctx.profileLoader.load(user.id);
        }
    }
};
  
  export const UserType = new GraphQLObjectType<UserBody, Context>({
    name: 'UserType', 
    fields: userTypeFields,
  });

  const TypeIdValues = {
    'basic': {
      value: MemberTypeId.BASIC
    },
    'business': {
      value: MemberTypeId.BUSINESS
    }
  }

  export const MTIdType = new GraphQLEnumType({
    name: 'MemberTypeId', 
    values: TypeIdValues,
  });
  

  export type Context = ReturnType<typeof getLoaders> & {
    prisma: PrismaClient;
  };
