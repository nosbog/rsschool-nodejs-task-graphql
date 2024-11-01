import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';


export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: ({ id }: { id: string; }, args, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.profile.findUnique({ where: { userId: id } });
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: ({ id }: { id: string; }, args, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.post.findMany({ where: { authorId: id } });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, { prisma }: { prisma: PrismaClient; }) => {
        console.log('subscribedToUser', source);
        console.log('subscribedToUser', args);
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: source.id },
          include: { subscriber: true },
        });
        return subscriptions.map(sub => sub.subscriber);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, { prisma }: { prisma: PrismaClient; }) => {
        console.log('userSubscribedTo', source);
        console.log('userSubscribedTo', args);
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: source.id },
          include: { author: true },
        });
        return subscriptions.map(sub => sub.author);
      }
    },
  })
});


export const UserQuery = new GraphQLObjectType({
  name: "UserQuery",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: (source, args, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.user.findMany();
      }
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: (source, { id }: { id: string; }, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.user.findUnique({ where: { id } });
      }
    },
  })
});


type UserDto = {
  name: string;
  balance: number;
};

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
});


export const UserMutation = new GraphQLObjectType({
  name: "UserMutation",
  fields: () => ({
    createUser: {
      type: UserType as GraphQLObjectType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (source, { dto }: { dto: UserDto; }, { prisma }: { prisma: PrismaClient; }) => {
        return await prisma.user.create({ data: dto });
      }
    },
    changeUser: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (source, { id, dto }: { id: string; dto: Partial<UserDto>; }, { prisma }: { prisma: PrismaClient; }) => {
        return await prisma.user.update({
          where: { id },
          data: dto,
        });
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: { prisma: PrismaClient; }) => {
        await prisma.user.delete({ where: { id } });
        return true;
      }
    },
    subscribeTo: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { userId, authorId }: { userId: string; authorId: string; }, { prisma }: { prisma: PrismaClient; }) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        return true;
      }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { userId, authorId }: { userId: string; authorId: string; }, { prisma }: { prisma: PrismaClient; }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        return true;
      }
    }
  })
})


