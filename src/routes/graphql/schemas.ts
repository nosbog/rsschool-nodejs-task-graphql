import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { memberTypeFields, MemberTypeId } from '../member-types/schemas.js';
import { profile } from 'console';

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
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
      profiles: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile)))}
    }),
  });
  
  const User = new GraphQLObjectType({
    name: 'User',
    fields:() => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
      profile: { 
        type: Profile,
        resolve: (parent, args, context) => {
          return context.prisma.profile
            .findUnique({ where: { id: parent.id} })
            .profile();
        },
      },
      
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.id } })
            .posts();
        },
      },

      userSubscribedTo: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SubscribersOnAuthors))),
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.id } })
            .userSubscribedTo();
        },
      },

      subscribedToUser: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SubscribersOnAuthors))),
        resolve: (parent, args, context) => {
          return context.prisma.user
            .findUnique({ where: { id: parent.id } })
            .subscribedToUser();
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
          return context.prisma.profile
            .findUnique({ where: { id: parent.id} })
            .subscriber();
        },
      },

      author: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.profile
            .findUnique({ where: { id: parent.id} })
            .author();
        },
      },
    },
  });

  const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },

      author: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.profile
            .findUnique({ where: { id: parent.id} })
            .author();
        },
      }
    },
  });

  const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      memberTypeId: { type: new GraphQLNonNull(GraphQLString) },

      user: {
        type: User,
        resolve: (parent, args, context) => {
          return context.prisma.profile
            .findUnique({ where: { id: parent.id} })
            .user();
        },
      },

      memberType: {
        type: MemberType,
        resolve: (parent, args, context) => {
          return context.prisma.profile
            .findUnique({ where: { id: parent.id} })
            .memberType();
        },
      },
    },
  });

  const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      memberTypes: { 
        type: new GraphQLList(MemberType) ,
        resolve: () => prisma.memberType.findMany(),
      },
      posts: { 
        type: new GraphQLList(Post) ,
        resolve: () => prisma.post.findMany(),
      },
      users: { 
        type: new GraphQLList(User) ,
        resolve: () => prisma.user.findMany(),
      },
      profiles: { 
        type: new GraphQLList(Profile) ,
        resolve: () => prisma.profile.findMany(),
      },
    },
  });

  return new GraphQLSchema({ query: Query });
};