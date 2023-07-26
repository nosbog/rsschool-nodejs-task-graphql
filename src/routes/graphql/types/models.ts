import { Profile, Post, User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import DataLoader from "dataloader";

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
      resolve: async (parent: Profile, args, { prisma, dataloaders }: FastifyInstance, info) => {
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const res = await prisma.memberType.findMany({
              where: { id: { in: ids as string[] } },
          })
          
          const sortedInIdsOrder = ids.map((id: string) => res.find(x => x.id === id));
              return sortedInIdsOrder;
          });
          dataloaders.set(info.fieldNodes, dl);
        }
          return dl.load(parent.memberTypeId);
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
      resolve: async (parent: Post, args, { prisma, /*httpErrors*/ dataloaders }: FastifyInstance, info) => {
        let dl = dataloaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const res = await prisma.user.findMany({
              where: { id: { in: ids as string[] } },
          })
          
          const sortedInIdsOrder = ids.map((id: string) => res.find(x => x.id === id));
              return sortedInIdsOrder;
          });
          dataloaders.set(info.fieldNodes, dl);
        }
          return dl.load(parent.id);
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
      resolve: async (parent: User, args, {prisma, dataloaders }: FastifyInstance, info) => {

        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const res = await prisma.profile.findMany({
              where: { userId: { in: ids as string[] } },
          })
          
          const sortedInIdsOrder = ids.map((id: string) => res.find(x => x.userId === id));
              return sortedInIdsOrder;
          });
          dataloaders.set(info.fieldNodes, dl);
        }
          return dl.load(parent.id);
      }
    },
    posts: {
      type: new GraphQLList(Posts),
      resolve: async (parent, args, context: FastifyInstance, info) => {
        const { dataloaders, prisma } = context;

        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const res = await prisma.post.findMany({
              where: { authorId: { in: ids as string[] } },
          })
          
          const sortedInIdsOrder = ids.map((id: string) => res.filter(x => x.authorId === id));
              return sortedInIdsOrder;
          });
          dataloaders.set(info.fieldNodes, dl);
        }
          return dl.load(parent.id);
      }
    },
    
    userSubscribedTo: {
      type: new GraphQLList(Users),
      
      resolve: async (parent, args, { prisma, dataloaders }: FastifyInstance, info) => {

        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const res = await prisma.user.findMany({
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: { in: ids as string[]  },
                  },
                },
              }, 
              include: {
                subscribedToUser: true,
             }
              
            });
          
          const sortedInIdsOrder = ids.map(id => res
            .filter(user => user.subscribedToUser.some((user) => user.subscriberId === id)));

          return sortedInIdsOrder;
        });
          dataloaders.set(info.fieldNodes, dl);
        }
          
          return dl.load(parent.id);
      },
      
    },
    subscribedToUser: {
      type: new GraphQLList(Users),
      resolve: async (parent, args, { prisma, dataloaders }: FastifyInstance, info) => {

        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const res = await prisma.user.findMany({
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: { in: ids as string[]  },
                  },
                },
              },
              include: {
                userSubscribedTo: true,
             }
            });

          const sortedInIdsOrder = ids.map(id => res
            .filter(user => user.userSubscribedTo.some((user) => user.authorId === id)));
  
            return sortedInIdsOrder
          });
          dataloaders.set(info.fieldNodes, dl);
        } 
          return dl.load(parent.id);
      },
    },
  }),
}); 