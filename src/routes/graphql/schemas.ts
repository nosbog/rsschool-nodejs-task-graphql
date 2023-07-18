import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLFloat, GraphQLObjectType, GraphQLInt, GraphQLSchema, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLID} from 'graphql';
import { MemberTypeId, UUIDType } from './types/uuid.js';

const prisma = new PrismaClient()

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

 const UserType:GraphQLObjectType  = new GraphQLObjectType({
   name: "User",
   fields: () => ({
     id: {type: new GraphQLNonNull(UUIDType)},
     name: {type: GraphQLString},
     balance: {type: GraphQLFloat},
     profile: {
       type: ProfileType,
      resolve: async (parent) => {
        const profile = await prisma.user.findUnique({ where: { id: parent.id } }).profile();
        return profile;
      }
      }
     ,
     posts: { 
       type: new GraphQLList(PostType), 
       resolve: async (parent: {id: string}) => {
         const posts = await prisma.user.findUnique({ where: { id: parent.id } }).posts();
        return posts;
       }
    },
    userSubscribedTo: {
      type: new GraphQLList(SubscribersOnAuthorsType),
      resolve: async (parent: {id: string}) => {
        const subscriptions = await prisma.user.findUnique({where: { id: parent.id }}).userSubscribedTo()
        return subscriptions
      }
    },
    subscribedToUser: {
      type: new GraphQLList(SubscribersOnAuthorsType),
      resolve: (parent) => {
        return prisma.user.findUnique({ where: { id: parent.id } }).subscribedToUser();
      },
    },
   })
 })

const SubscribersOnAuthorsType: GraphQLObjectType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: {
      type: UserType,
      resolve: async (parent: {subscriberId: string, authorId: string}) => {
        const subscriber = await prisma.subscribersOnAuthors.findUnique({ where: { subscriberId_authorId: { subscriberId: parent.subscriberId, authorId: parent.authorId } } }).subscriber();
        return subscriber;
      },
    },
    author: {
      type: UserType,
      resolve: async (parent) => {
        const author = await prisma.subscribersOnAuthors.findUnique({ where: { subscriberId_authorId: { subscriberId: parent.subscriberId, authorId: parent.authorId } } }).author();
        return author;
      },
    },
  }),
})

const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    user: {
      type: UserType,
      resolve: async (parent: {id: string}) => {
        const user = await prisma.profile.findUnique({where: {id: parent.id}}).user()
        return user
      }
    },
    memberType: {
      type: MemberType,
      resolve: async (parent) => {
        const memberType = await prisma.profile.findUnique({where: {id: parent.id}}).memberType()
        return memberType
      }
    }
  })
})

const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    author: {
      type: UserType,
      resolve: async (parent: {id: string}) => {
        const author = await prisma.post.findUnique({where: {id: parent.id}}).author()
        return author
      }
    },
  })
})

const MemberType: GraphQLObjectType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: {type: new GraphQLNonNull(MemberTypeId)},
    discount: {type: GraphQLFloat},
    postsLimitPerMonth: {type: GraphQLInt},
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent: {id: string}) => {
        const profiles = await prisma.memberType.findUnique({where: {id: parent.id}}).profiles()
        return profiles
      }
    },
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (_, {id}: {id: string}) => {
        const user = await prisma.user.findUnique({where: {id},})
        return user
      } 
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        const users = await prisma.user.findMany()
        return users
      }
    },
    post: {
      type: PostType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (_, {id}: {id: string}) => {
        const post = await prisma.post.findUnique({where: {id}})
        return post
      } 
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => {
        const posts = await prisma.post.findMany()
        return posts
      }
    },
    profile: {
      type: ProfileType,
      args: {id: {type: new GraphQLNonNull(UUIDType)}},
      resolve: async (_, {id}: {id: string}) => {
        const profile = await prisma.profile.findUnique({where: {id}})
        return profile
      } 
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => {
        const profiles = await prisma.profile.findMany()
        return profiles
      }
    },
    memberType: {
      type: MemberType,
      args: {id: { type: MemberTypeId } },
      resolve: async (_, args: {id:string}) => {
        const memberType = await prisma.memberType.findUnique({where: {id: args.id}})
        return memberType
      } 
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => {
        const memberTypes = await prisma.memberType.findMany()
        return memberTypes
      }
    }
  }
})

export const graphQLSchema = new GraphQLSchema({
  query: RootQuery
})



