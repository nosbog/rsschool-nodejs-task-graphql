import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import { Post, PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { doesNotReject } from 'assert';

const prisma = new PrismaClient();

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const SubscribedToUser = new GraphQLObjectType({
  name: 'SubscribedToUser',
  fields: () => ({
    id: { type: GraphQLString },
    userSubscribedTo: {
      type: new GraphQLList(UserSubscribedTo),
      resolve: (root: { id: string }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: root.id,
              },
            },
          },
        });
      },
    },
  }),
});

const UserSubscribedTo = new GraphQLObjectType({
  name: 'UserSubscribedTo',
  fields: () => ({
    id: { type: GraphQLString },
    subscribedToUser: {
      type: new GraphQLList(SubscribedToUser),
      resolve: (root: { id: string }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: root.id,
              },
            },
          },
        });
      },
    },
  }),
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: (root: { id: string }) => {
        return prisma.profile.findUnique({
          where: {
            userId: root.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: (root: { id: string }) => {
        return prisma.post.findMany({
          where: {
            authorId: root.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserSubscribedTo),
      resolve: (root: { id: string }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: root.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(SubscribedToUser),
      resolve: (root: { id: string }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: root.id,
              },
            },
          },
        });
      },
    },
  }),
});

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: MemberType,
      resolve(root: { memberTypeId: string }) {
        return prisma.memberType.findUnique({ where: { id: root.memberTypeId } });
      },
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (root, args, context) => {
        return prisma.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (root, args, context) => {
        return prisma.post.findMany();
      },
    },
    users: {
      type: new GraphQLList(User),
      resolve: async (root, args, context) => {
        return prisma.user.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (root, args, context) => {
        return prisma.profile.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (root, args: { id: string }, context: { prisma: PrismaClient }) => {
        try {
          return context.prisma.memberType.findUnique({ where: { id: args.id } });
        } catch (e) {
          return null;
        }
      },
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args: { id: string }, context) => {
        try {
          return prisma.post.findUnique({ where: { id: args.id } });
        } catch (e) {
          return null;
        }
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args: { id: string }, context) => {
        try {
          return prisma.user.findUnique({ where: { id: args.id } });
        } catch (e) {
          return null;
        }
      },
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args: { id: string }, context) => {
        try {
          return prisma.profile.findUnique({ where: { id: args.id } });
        } catch (e) {
          return null;
        }
      },
    },
  }),
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: GraphQLString },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    //   content: { type: GraphQLString },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    //   yearOfBirth: { type: GraphQLInt },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    //   balance: { type: GraphQLFloat },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: User,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      async resolve(
        parent,
        { dto }: { dto: { name: string; balance: number } },
        context,
      ) {
        const createdUser = await prisma.user.create({
          data: {
            name: dto.name,
            balance: dto.balance,
          },
        });
        return createdUser;
      },
    },
    createProfile: {
      type: Profile,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      async resolve(
        parent,
        {
          dto,
        }: {
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        context,
      ) {
        const authorExists = await prisma.user.findUnique({
          where: {
            id: dto.userId,
          },
        });

        if (!authorExists) {
          throw new Error(`User with id ${dto.userId} does not exist.`);
        }

        const createdProfile = await prisma.profile.create({
          data: {
            isMale: dto.isMale,
            yearOfBirth: dto.yearOfBirth,
            userId: dto.userId,
            memberTypeId: dto.memberTypeId,
          },
        });
        return createdProfile;
      },
    },
    createPost: {
      type: Post,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      async resolve(
        parent,
        { dto }: { dto: { title: string; content: string; authorId: string } },
        context,
      ) {
        const authorExists = await prisma.user.findUnique({
          where: {
            id: dto.authorId,
          },
        });

        if (!authorExists) {
          throw new Error(`Author with id ${dto.authorId} does not exist.`);
        }

        const createdPost = await prisma.post.create({
          data: {
            title: dto.title,
            content: dto.content,
            authorId: dto.authorId,
          },
        });
        return createdPost;
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, { id }: { id: string }, context) {
        try {
          await prisma.post.delete({
            where: {
              id: id,
            },
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, { id }: { id: string }, context) {
        try {
          await prisma.profile.delete({
            where: {
              id: id,
            },
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, { id }: { id: string }, context) {
        try {
          await prisma.user.delete({
            where: {
              id: id,
            },
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
    changePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },

      async resolve(
        parent,
        { id, dto }: { id: string; dto: any },
        context,
      ) {
        const updatedPost = await prisma.post.update({
          where: {
            id: id,
          },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: {
            ...dto,
          },
        });
        return updatedPost;
      },
    },
    changeProfile: {
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        async resolve(parent, { id, dto }:  { id: string; dto: any }, context) {
          const updatedProfile = await prisma.profile.update({
            where: {
              id: id,
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: {
              ...dto,
            },
          });
          return updatedProfile;
        },
      },
      changeUser: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        async resolve(parent, { id, dto }:  { id: string; dto: any }, context) {
            console.log(id, dto);
          const updatedUser = await prisma.user.update({
            where: {
              id: id,
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: {
              ...dto,
            },
          });
          return updatedUser;
        },
      },
  }),
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutations,
});

export { schema };
