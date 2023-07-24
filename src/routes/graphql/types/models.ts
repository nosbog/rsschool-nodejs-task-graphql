import { Profile, Post, User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
  basic: { value: 'basic' }, 
  business: { value: 'business' },
  }
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      discount: {type: GraphQLFloat},
      postsLimitPerMonth: {type: GraphQLInt},
    })
});



export const Profiles = new GraphQLObjectType({
  name: 'Profile',
  fields: () =>({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean }, 
    yearOfBirth: { type: GraphQLInt },
  
    user: {
      type: Users,
      resolve: async (parent: Profile, args, { prisma, httpErrors }: FastifyInstance) => {
        const res = await prisma.user.findUnique({ where: { id: parent.userId } });
  
        if (!res) {
          throw httpErrors.notFound()
      }
        return res || null;
       },
      },
    userId: {type: UUIDType},
    memberTypeId: {type: MemberTypeIdEnum},
    memberType: {
      type: MemberType,
      resolve: async (parent: Profile, args, { prisma }: FastifyInstance) => {
        const res = await prisma.memberType.findUnique({ 
          where: { id: parent.memberTypeId } 
        });
    
        return res;
        },
      },
    })
  });

export const Posts = new GraphQLObjectType({
  name: 'Post',
  fields: () =>({
    id: { type: new GraphQLNonNull(UUIDType) }, 
    title: { type: GraphQLString }, 
    content: { type: GraphQLString }, 

    authorId: { type: UUIDType },
  
    author: {
      type: Users,
      resolve: async (parent: Post, args, { prisma, httpErrors }: FastifyInstance) => {
        const res = await prisma.user.findUnique({ 
          where: { id: parent.authorId } 
        });
        if (!res) {
          throw httpErrors.notFound()
      }
    
      return res;
      },
    },
  }),
});


export const Users: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: Profiles,
      resolve: async (parent: User, args, {prisma}: FastifyInstance) => {
          const profile = await prisma.profile.findUnique({
              where: {
                  userId: parent.id
              }
          })
          return profile ? profile : null
      }
    },
    posts: {
      type: new GraphQLList(Posts),
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
          return await prisma.post.findMany({
              where: {
                  authorId: parent.id
              }
          })
      }
    },
    
    userSubscribedTo: {
      type: new GraphQLList(Users),
      
      resolve: async (parent, args, { prisma, /*httpErrors*/ }: FastifyInstance) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
        });
        const authorIds = subscriptions.map((sub) => sub.authorId);
    
        const res = await prisma.user.findMany({ where: { id: { in: authorIds } } });
        return res;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(Users),
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
      
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
        });
        
        const subscriberIds = subscribers.map((sub) => sub.subscriberId);
    
        return await prisma.user.findMany({ where: { id: { in: subscriberIds } } });
      },
    },
  }),
}); 