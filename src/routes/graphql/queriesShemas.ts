import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType, 
  GraphQLString} from 'graphql';
import { UUIDType } from './types/uuid.js';
import  { FastifyInstance } from 'fastify';
import { Post, Profile, User } from '@prisma/client';

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
  basic: { value: 'basic' }, 
  business: { value: 'business' },
  }
  });
  

const MemberType = new GraphQLObjectType({
  name: 'memberTypes',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeId) },
      discount: {type: GraphQLFloat},
      postsLimitPerMonth: {type: GraphQLInt},
    })
});



const Profiles = new GraphQLObjectType({
  name: 'profiles',
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
    memberTypeId: {type: MemberTypeId},
    memberType: {
      type: MemberType,
      resolve: async (parent: Profile, args, { prisma, httpErrors }: FastifyInstance) => {
        const res = await prisma.memberType.findUnique({ where: { id: parent.    memberTypeId } });
    
        if (!res) {
          throw httpErrors.notFound()
        }
        return res;
        },
      },
    })
  });

  const Posts = new GraphQLObjectType({
    name: 'posts',
    fields: () =>({
      id: { type: new GraphQLNonNull(UUIDType) }, 
      title: { type: GraphQLString }, 
      content: { type: GraphQLString }, 
  
      authorId: { type: UUIDType },
    
      author: {
        type: Users,
        resolve: async (parent: Post, args, { prisma, httpErrors }: FastifyInstance) => {
          const res = await prisma.user.findUnique({ where: { id: parent.authorId } });
          if (!res) {
            throw httpErrors.notFound()
        }
      
        return res;
        },
      },
    }),
  });


const Users: GraphQLObjectType = new GraphQLObjectType({
  name: 'users',
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
      
      resolve: async (parent, args, { prisma, httpErrors }: FastifyInstance) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: parent.id },
      });
      const authorIds = subscriptions.map((sub) => sub.authorId);
  
      const res = await prisma.user.findMany({ where: { id: { in: authorIds } } });
      if (!res) {
        throw httpErrors.notFound()
      }
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

  export const queries = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(Users),
        
        resolve: async (_, args, { prisma}: FastifyInstance) => {return await prisma.user.findMany()} 
      },
      user: {
         type: Users,
         args: {id:{type: UUIDType}},
         resolve: async (_, args: { id: string}, { prisma}: FastifyInstance) => {
           const res = await prisma.user.findUnique({ where: {id: args.id}});
           return res || null;
         }
      },

      posts: {
        type: new GraphQLList(Posts),
        resolve: async (_, args, { prisma}: FastifyInstance) => (await prisma.post.findMany ())
      },
      post: {
        type: Posts,
        args: {id:{type: UUIDType}},
        resolve: async (_, args: { id: string}, { prisma}: FastifyInstance) => {
          const res = await prisma.post.findUnique({ where: {id: args.id}});
          return res || null;
        }
      },

      profiles: {
        type: new GraphQLList(Profiles),
        resolve: async (_, args, { prisma}: FastifyInstance) => (await prisma.profile. findMany())
      },
      profile: {
       type: Profiles,
       args: {id:{type: UUIDType}},
       resolve: async (_, args: { id: string}, { prisma}: FastifyInstance) => {
         const res = await prisma.profile.findUnique({ where: {id: args.id}});
         return res || null;
       }
      },

      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_, args, { prisma}: FastifyInstance) => { return await prisma. memberType.findMany()}
      },
      memberType: {
        type: MemberType,
        args: {id: {type: MemberTypeId}},
        resolve: async (_, args: { id: string}, { prisma, httpErrors }: FastifyInstance) => {
          const res =  await prisma.memberType.findUnique({ where: {id: args.id}});
          if (!res) {
            throw httpErrors.notFound()
        }
          return res || null;
        }
       }
    }
  })
