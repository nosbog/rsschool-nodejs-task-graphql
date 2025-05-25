import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { PrismaClient, Post as PrismaPost, User as PrismaUser, Profile as PrismaProfile, MemberType as PrismaMemberType } from '@prisma/client';
import DataLoader from 'dataloader';
import { User } from './user.js';

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

interface PostParent {
    id: string;
    authorId: string;
}

export const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
        author: {
            type: new GraphQLNonNull(User),
            resolve: async (parent: PostParent, _, context: Context) => {
                return context.loaders.userLoader.load(parent.authorId);
            },
        },
    },
});

export const CreatePost = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    },
});

export const UpdatePost = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    },
});