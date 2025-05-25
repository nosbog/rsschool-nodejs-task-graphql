import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Post } from "./posts.js";
import { Profile } from "./profile.js";
import { PrismaClient, User as PrismaUser, Post as PrismaPost, Profile as PrismaProfile, MemberType as PrismaMemberType } from '@prisma/client';
import DataLoader from 'dataloader';

interface Context {
    prisma: PrismaClient;
    loaders: {
        userLoader: DataLoader<string, PrismaUser & {
            profile?: (PrismaProfile & { memberType?: PrismaMemberType }) | null;
            posts?: PrismaPost[];
            userSubscribedTo?: { author: PrismaUser }[];
            subscribedToUser?: { subscriber: PrismaUser }[];
        }>;
        postLoader: DataLoader<string, PrismaPost>;
        profileLoader: DataLoader<string, PrismaProfile & { memberType?: PrismaMemberType }>;
        memberTypeLoader: DataLoader<string, PrismaMemberType>;
    };
}

interface UserParent {
    id: string;
}

export const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        profile: {
            type: Profile,
            resolve: async (parent: UserParent, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.profile || null;
            },
        },
        posts: {
            type: new GraphQLList(Post),
            resolve: async (parent: UserParent, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.posts || [];
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(User),
            resolve: async (parent: UserParent, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.userSubscribedTo?.map(sub => sub.author) || [];
            },
        },
        subscribedToUser: {
            type: new GraphQLList(User),
            resolve: async (parent: UserParent, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.subscribedToUser?.map(sub => sub.subscriber) || [];
            },
        },
    }),
});

export const CreateUser = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
});

export const UpdateUser = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    },
}); 