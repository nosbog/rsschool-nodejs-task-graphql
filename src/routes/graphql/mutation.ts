import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql';
  import { Post, User, Profile, GraphQLMemberTypeId } from './query.js';
  import { UUIDType } from './types/uuid.js';
  import { Context } from './types/interfaces.js';
  import { PostDto, PostModel, ProfileDto, ProfileModel, UserDto, UserModel } from './types/models.js';
  import { UUID } from 'crypto';
  
  const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
  });
  
  const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
  });
  
  const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId) },
      userId: { type: new GraphQLNonNull(UUIDType) },
    },
  });
  
  const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
      title: { type: GraphQLString },
      content: { type: GraphQLString },
    },
  });
  
  const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },
    },
  });
  
  const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      memberTypeId: { type: GraphQLMemberTypeId },
    },
  });
  
  export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      // Post mutation
      createPost: {
        type: Post,
        args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
        resolve: async (
          root,
          args: { dto: PostDto },
          context: Context,
        ): Promise<PostModel> => await context.prisma.post.create({ data: args.dto }),
      },
      deletePost: {
        type: new GraphQLNonNull(UUIDType),
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (root, { id }: { id: UUID }, context: Context) => {
          await context.prisma.post.delete({
            where: { id },
          });
          return id;
        },
      },
      changePost: {
        type: Post,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: async (
          root,
          { id, dto }: { id: UUID; dto: PostDto },
          { prisma }: Context,
        ) =>
          await prisma.post.update({
            where: { id },
            data: dto,
          }),
      },
  
      // User mutation
      createUser: {
        type: User,
        args: { dto: { type: CreateUserInput } },
        resolve: async (
          root,
          args: { dto: UserDto },
          context: Context,
        ): Promise<UserModel> => await context.prisma.user.create({ data: args.dto }),
      },
      deleteUser: {
        type: new GraphQLNonNull(UUIDType),
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (root, { id }: { id: UUID }, context: Context) => {
          await context.prisma.user.delete({
            where: { id },
          });
          return id;
        },
      },
      changeUser: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        resolve: async (
          root,
          { id, dto }: { id: UUID; dto: UserDto },
          { prisma }: Context,
        ) =>
          await prisma.user.update({
            where: { id },
            data: dto,
          }),
      },
  
      // Profile mutation
      createProfile: {
        type: Profile,
        args: { dto: { type: CreateProfileInput } },
        resolve: async (
          root,
          args: { dto: ProfileDto },
          context: Context,
        ): Promise<ProfileModel> => await context.prisma.profile.create({ data: args.dto }),
      },
      deleteProfile: {
        type: new GraphQLNonNull(UUIDType),
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (root, { id }: { id: UUID }, context: Context) => {
          await context.prisma.profile.delete({
            where: { id },
          });
          return id;
        },
      },
      changeProfile: {
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: async (
          root,
          { id, dto }: { id: UUID; dto: ProfileDto },
          { prisma }: Context,
        ) =>
          await prisma.profile.update({
            where: { id },
            data: dto,
          }),
      },
  
      // Subscription mutation
      subscribeTo: {
        type: User,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (
          root,
          { userId: id, authorId }: { userId: UUID; authorId: UUID },
          { prisma }: Context,
        ) =>
          await prisma.user.update({
            where: {
              id,
            },
            data: {
              userSubscribedTo: {
                create: {
                  authorId,
                },
              },
            },
          }),
      },
      unsubscribeFrom: {
        type: new GraphQLNonNull(UUIDType),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (
          root,
          { userId: subscriberId, authorId }: { userId: UUID; authorId: UUID },
          { prisma }: Context,
        ) => {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId,
                authorId,
              },
            },
          });
          return subscriberId;
        },
      },
    },
  });