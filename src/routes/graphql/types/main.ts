import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType, MemberTypeId } from "./member-type.js";
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { CreateProfile, Profile, UpdateProfile } from "./profile.js";

interface Context {
    prisma: PrismaClient;
}

interface CreateProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
}

interface UpdateProfileInput {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
}

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_: unknown, args: unknown, context: Context) => await context.prisma.memberType.findMany(),
        },
        memberType: {
            type: MemberType,
            args: { id: { type: MemberTypeId } },
            resolve: async (_: unknown, args: { id: string }, context: Context) => await context.prisma.memberType.findUnique({ where: { id: args.id } }),
        },
        profiles: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
            resolve: (_, args, context) => context.prisma.profile.findMany(),
        },
        profile: {
            type: Profile,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: { id: string }, context) => await context.prisma.profile.findUnique({ where: { id: args.id } }),
        },
    }
})

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createProfile: {
            type: new GraphQLNonNull(Profile),
            args: {
                dto: { type: new GraphQLNonNull(CreateProfile) }
            },
            resolve: async (_, { dto }: { dto: CreateProfileInput }, context: Context) => await context.prisma.profile.create({ data: dto }),
        },
        changeProfile: {
            type: new GraphQLNonNull(Profile),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(UpdateProfile) }
            },
            resolve: async (_, { id, dto }: { id: string, dto: UpdateProfileInput }, context: Context) => await context.prisma.profile.update({ where: { id }, data: dto }),
        },
        deleteProfile: {
            type: new GraphQLNonNull(Profile),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: { id: string }, context: Context) => await context.prisma.profile.delete({ where: { id } }),
        },
    }
})