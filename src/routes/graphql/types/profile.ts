import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType, MemberTypeId } from "./member-type.js";
import { UUIDType } from "./uuid.js";
import { PrismaClient, Profile as PrismaProfile, MemberType as PrismaMemberType, User as PrismaUser, Post as PrismaPost } from '@prisma/client';
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

interface ProfileParent {
    id: string;
    memberTypeId: string;
}

export const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
        memberType: {
            type: MemberType,
            resolve: async (parent: ProfileParent, _, context: Context) => {
                const profile = await context.loaders.profileLoader.load(parent.id);
                return profile?.memberType || null;
            },
        },
    },
});

export const CreateProfile = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
        userId: { type: new GraphQLNonNull(UUIDType) },
    },
});

export const UpdateProfile = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeId },
    },
});