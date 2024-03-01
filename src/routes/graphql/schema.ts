import { Static } from '@fastify/type-provider-typebox';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';
import { createPostSchema } from '../posts/schemas.js';
import { changeProfileByIdSchema, createProfileSchema } from '../profiles/schemas.js';
import { createUserSchema } from '../users/schemas.js';
import { Context } from './types/context.js';
import { UUIDType } from './types/uuid.js';

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberType: {
      type: MemberTypeType,
      resolve: async (parent, args, context: Context) => {
        const profile = await context.prisma.profile.findUnique({
          where: { id: parent.id },
          include: {
            memberType: true,
          },
        });

        return profile?.memberType;
      },
    },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType },
    posts: { type: new GraphQLList(PostType) },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: Context) => {
        const subscriptions = await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });

        return subscriptions;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: Context) => {
        const subscriptions = await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });

        return subscriptions;
      },
    },
  }),
});

const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: {
    subscriber: { type: UserType },
    subscriberId: { type: UUIDType },
    author: { type: UserType },
    authorId: { type: UUIDType },
  },
});

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, args, context: Context) => {
        const users = await context.prisma.user.findMany({
          include: {
            profile: true,
            posts: true,
            subscribedToUser: true,
            userSubscribedTo: true,
          },
        });

        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: { id: args.id },
          include: {
            profile: true,
            posts: true,
            subscribedToUser: true,
            userSubscribedTo: true,
          },
        });

        return user;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_, args, context: Context) => {
        const memberTypes = await context.prisma.memberType.findMany();

        return memberTypes;
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: MemberTypeIdEnum },
      },
      resolve: async (_, args: { id: MemberTypeId }, context: Context) => {
        const memberType = await context.prisma.memberType.findUnique({
          where: { id: args.id },
        });

        return memberType;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_, args, context: Context) => {
        const posts = await context.prisma.post.findMany();

        return posts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id },
        });

        return post;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_, args, context: Context) => {
        const profiles = await context.prisma.profile.findMany();

        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        const profile = await context.prisma.profile.findUnique({
          where: { id: args.id },
        });

        return profile;
      },
    },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

type CreatePostDto = Static<(typeof createPostSchema)['body']>;

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

type CreateUserDto = Static<(typeof createUserSchema)['body']>;

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

type CreateProfileDto = Static<(typeof createProfileSchema)['body']>;

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

type ChangeProfileDto = Static<(typeof changeProfileByIdSchema)['body']>;

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

type ChangePostDto = Static<(typeof createPostSchema)['body']>;

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

type ChangeUserDto = Static<(typeof createUserSchema)['body']>;

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: {
          type: CreateUserInput,
        },
      },
      resolve: async (_, args: { dto: CreateUserDto }, context: Context) => {
        const user = await context.prisma.user.create({
          data: args.dto,
        });

        return user;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        await context.prisma.user.delete({
          where: { id: args.id },
        });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: UUIDType },
        dto: {
          type: ChangeUserInput,
        },
      },
      resolve: async (_, args: { id: string; dto: ChangeUserDto }, context: Context) => {
        const user = await context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });

        return user;
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: {
          type: CreatePostInput,
        },
      },
      resolve: async (_, args: { dto: CreatePostDto }, context: Context) => {
        const post = await context.prisma.post.create({
          data: args.dto,
        });

        return post;
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDType },
        dto: {
          type: ChangePostInput,
        },
      },
      resolve: async (_, args: { id: string; dto: ChangePostDto }, context: Context) => {
        const post = await context.prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });

        return post;
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        await context.prisma.post.delete({
          where: { id: args.id },
        });
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (
        _,
        args: {
          dto: CreateProfileDto;
        },
        context: Context,
      ) => {
        const profile = await context.prisma.profile.create({
          data: args.dto,
        });

        return profile;
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeProfileInput },
      },
      resolve: async (
        _,
        args: {
          id: string;
          dto: ChangeProfileDto;
        },
        context: Context,
      ) => {
        const profile = await context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });

        return profile;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, args: { id: string }, context: Context) => {
        await context.prisma.profile.delete({
          where: { id: args.id },
        });
      },
    },
  },
});

export const schema = new GraphQLSchema({
  types: [UserType, MemberTypeType, PostType, ProfileType, SubscribersOnAuthorsType],
  query: rootQuery,
  mutation: Mutation,
});
