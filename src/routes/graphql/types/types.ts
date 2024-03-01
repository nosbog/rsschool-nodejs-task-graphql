import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLEnumType, GraphQLList } from "graphql";
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from "./uuid.js";
import { getLoaders } from "./loaders.js";
import { PostBody, UserBody } from "../schemas.js";

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
  
  export const UserType = new GraphQLObjectType<UserBody, Context>({
    name: 'UserType', 
    fields: () => ({
      id: { type: UUIDType },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },
      profile: {
          type: ProfileType,
          resolve: async (user: UserBody, _, ctx: Context) => {
              const profile = await ctx.profileLoader.load(user.id);
              console.log('profile: ', profile);
          if (!profile) {
            return null; 
          }
          return profile; 
          }
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (user, _, ctx: Context) => {
          const posts = await ctx.postsLoader.load(user.id);
          if (!posts) {
            return null; 
          }
          return posts; 
        }
    }
    })
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
