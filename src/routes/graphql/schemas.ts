import { Type } from '@fastify/type-provider-typebox';
import { 
  GraphQLObjectType,
  GraphQLSchema, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean, 
  GraphQLList, 
  GraphQLNonNull, 
  GraphQLFloat, 
  GraphQLEnumType,
 } from 'graphql';
import { UUIDType } from './types/uuid.js';

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

export function createSchema(prisma: any) {
  const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields:  () => ({
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
      profiles: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile)))}
    }),
  });
  
  const User = new GraphQLObjectType({
    name: 'User',
    fields:() => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },

      profile: { 
        type: Profile,
        resolve: (parent, args, context) => {
          return context.prisma.profile
            .findUnique({ where: { userId: parent.id} });  
        },
      },
      
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
        resolve: (parent, args, context) => {
          return context.prisma.post
            .findMany({ where: { authorId: parent.id } });
        },
      },

      userSubscribedTo: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        resolve: async (parent, args, context) => {
          const userIsSubLinks = await context.prisma.subscribersOnAuthors
            .findMany({ where: { subscriberId: parent.id } });

          const authors = await context.prisma.user
            .findMany({ where: { id: { in: userIsSubLinks.map((link) => link.authorId) } }});

          return authors;
        },
      },

      subscribedToUser: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        resolve: async (parent, args, context) => {
          const userIsAuthorLinks = await context.prisma.subscribersOnAuthors
            .findMany({ where: { authorId: parent.id } });

          const subscribers = await context.prisma.user
            .findMany({ where: { id: { in: userIsAuthorLinks.map((link) => link.subscriberId) } }});

          return subscribers;
        },
      },
    }),
  });

  const SubscribersOnAuthors = new GraphQLObjectType({
    name: 'SubscribersOnAuthors',
    fields: {
      subscriber: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.subscriberId} });
        },
      },

      author: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.authorId} });
        },
      },
    },
  });

  const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
      id: { type: new GraphQLNonNull(UUIDType) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },

      author: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.authorId} });
        },
      }
    },
  });

  const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },

      user: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.userId} });
        },
      },

      memberType: {
        type: MemberType,
        resolve: (parent, args, context) => {
          return context.prisma.memberType
            .findUnique({ where: { id: parent.memberTypeId} });
        },
      },
    }),
  });

  const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      BASIC: { value: 'BASIC' },
      BUSINESS: { value: 'BUSINESS'},
    },
  });

  const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      memberTypes: { 
        type: new GraphQLList(MemberType) ,
        resolve: (_, __, context) => context.prisma.memberType.findMany(),
      },
      memberType: { 
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: (_, { id }, context) => context.prisma.memberType.findUnique({ where: { id } }),
      },
      posts: { 
        type: new GraphQLList(Post) ,
        resolve: (_, __, context) => context.prisma.post.findMany(),
      },
      post: { 
        type: Post,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, { id }, context) => context.prisma.post.findUnique({ where: { id } }),
      },
      users: { 
        type: new GraphQLList(User) ,
        resolve: (_, __, context) => context.prisma.user.findMany(),
      },
      user: { 
        type: User,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, { id }, context) => context.prisma.user.findUnique({ where: { id } }),
      },
      profiles: { 
        type: new GraphQLList(Profile) ,
        resolve: (_, __, context) => context.prisma.profile.findMany(),
      },
      profile: { 
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, { id }, context) => context.prisma.profile.findUnique({ where: { id } }),
      },
    },
  });

  return new GraphQLSchema({ query: Query });
};

