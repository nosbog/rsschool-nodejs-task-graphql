import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { PrismaClient, MemberType as PrismaMemberType, User as PrismaUser, Post as PrismaPost, Profile as PrismaProfile } from '@prisma/client';
import DataLoader from 'dataloader';

interface Context {
    prisma: PrismaClient;
    loaders: {
        userLoader: DataLoader<string, PrismaUser & {
            profile?: PrismaProfile | null;
            posts?: PrismaPost[];
            userSubscribedTo?: { author: PrismaUser }[];
            subscribedToUser?: { subscriber: PrismaUser }[];
        }>;
        postLoader: DataLoader<string, PrismaPost>;
        profileLoader: DataLoader<string, PrismaProfile & { memberType?: PrismaMemberType }>;
        memberTypeLoader: DataLoader<string, PrismaMemberType>;
    };
}

interface MemberTypeParent {
    id: string;
}

export const MemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: { value: 'basic' },
        BUSINESS: { value: 'business' },
    },
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
        discount: { type: new GraphQLNonNull(GraphQLFloat) },
        postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    },
});