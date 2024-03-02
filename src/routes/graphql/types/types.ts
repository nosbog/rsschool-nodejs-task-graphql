import { PrismaClient, Profile } from "@prisma/client";
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLEnumType, GraphQLList } from "graphql";
import { UUIDType } from "./uuid.js";
import { getLoaders } from "./loaders.js";
import { UserBody } from "../schemas.js";

const TypeIdValues = {
  basic: {
    value: 'basic'
  },
  business: {
    value: 'business'
  }
}

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId', 
  values: TypeIdValues,
});

const memberTypeFields = {
    id: { type: MemberTypeIdType },
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
    memberType: {
      type: MemberType,
      resolve: async (profile: Profile, _, ctx: Context) => {
        
        const memberType = await ctx.prisma.memberType.findUnique({
          where: {
            id: profile.memberTypeId,
          }});
      if (!memberType) {
        return null; 
      }
      return memberType;
    }
  },
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
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _, ctx: Context) => {
        const userSubscribers = await ctx.prisma.subscribersOnAuthors.findMany({
          where: {
              subscriberId: user.id
          },
          select: { author: true }
      });
      if (!userSubscribers) {
        return null; 
      }
      return userSubscribers.map(item => item.author);
    }
  },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _, ctx: Context) => {
        const userSubscribers = await ctx.prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: user.id
          },
          select: { subscriber: true }
      });
      if (!userSubscribers) {
        return null; 
      }
      return userSubscribers.map(item => item.subscriber);
      }
    }
    })
  });

  export type Context = ReturnType<typeof getLoaders> & {
    prisma: PrismaClient;
  };

  export type Profile_Type = {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
  };
