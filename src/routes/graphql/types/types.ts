import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import {UUIDType} from './uuid.js';

export const MemberTypeIdType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        basic: { value: 'basic' },
        business: { value: 'business' },
    },
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: { type: MemberTypeIdType },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
        profiles: { type: new GraphQLList(ProfileType),
            resolve: async ({id}, args, context) => {
                return await context.prisma.profile.findMany({ where: { memberTypeId: id } });
            },
        },
    }),
});


export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: UUIDType },
        user: { type: UserType,
            resolve: async ({ userId }, args, context) => {
                return context.prisma.user.findFirst({ where: { id: userId } });
            },
        },
        memberType: {
            type: MemberType,
            resolve: async (source, args, context) => {
                return await context.loaders.memberLoader.load(source.memberTypeId);
            },
        },
        memberTypeId: { type: MemberTypeIdType } }),
});


export const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: GraphQLString },
        author: {
            type: UserType,
            resolve: async ({authorId}, args, context) => {
                return context.prisma.user.findFirst({ where: { id: authorId } });
            },
        },
    }),
});


export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: {
            type: ProfileType,
            resolve: async (source, args, context) => {
                return await context.loaders.profileLoader.load(source.id);
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (source, args, context) => {
                // console.log('calling post loader from user with source.id:' + source.id);
                return await context.loaders.postLoader.load(source.id);
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }, args, context) => {
                return context.data.subscriptions ? context.data.subscriptions.get(id) : await context.loaders.userSubscribedToLoader.load(id);
            },
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }, args, context) => {
                return context.data.subscribers ? context.data.subscribers.get(id) : await context.loaders.subscribedToUserLoader.load(id);
            },
        },
    }),
});


export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({ name: { type: GraphQLString },
                     balance: { type: GraphQLFloat },
    }),
});