import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLID,
} from 'graphql/type';
import { mergeSchemas } from '@graphql-tools/schema';
import {
    UserType, ProfileType, PostType, MemberType,
} from './graphql.types';
import { getByOneResolvers, getUsersWithTheirInfo, getUserByIdWithInfo, getUsersProfileWithSubscribes, getUserByIdWithSubscribesAndPosts, getUsersWithSubsAndSubscribes, createRequests, updateRequests } from './resolvers';


export const querySchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            users: {
                type: new GraphQLList(UserType),
                resolve: async (_, __, ctx) => {
                    return await ctx.db.users.findMany();
                },
            },
            profiles: {
                type: new GraphQLList(ProfileType),
                resolve: async (_, __, ctx) => {
                    return await ctx.db.profiles.findMany();
                },
            },
            posts: {
                type: new GraphQLList(PostType),
                resolve: async (_, __, ctx) => {
                    return await ctx.db.posts.findMany();
                },
            },
            memberTypes: {
                type: new GraphQLList(MemberType),
                resolve: async (_, __, ctx) => {
                    return await ctx.db.memberTypes.findMany();
                },
            },
            ...getByOneResolvers,
            ...getUsersWithTheirInfo,
            ...getUserByIdWithInfo,
            ...getUsersProfileWithSubscribes,
            ...getUserByIdWithSubscribesAndPosts,
            ...getUsersWithSubsAndSubscribes
        },
    }),
});


export const mutationSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            ...createRequests,
            ...updateRequests,
            subscribeTo: {
                type: UserType,
                description: "Subscribe to user",
                args: {
                    id: { type: GraphQLID },
                    userId: { type: GraphQLID }
                },
                resolve: async (_, args, ctx) => {
                    return await ctx.db.users.change(args.id, { subscribedToUserIds: args.userId })
                }
            },
            unsubscribeFrom: {
                type: UserType,
                description: "Subscribe to user",
                args: {
                    id: { type: GraphQLID },
                    userId: { type: GraphQLID }
                },
                resolve: async (_, args, ctx) => {
                    const user = await ctx.db.users.findOne({ key: "id", equals: args.id })
                    return await ctx.db.users.change(args.id, { subscribedToUserIds: user?.subscribedToUserIds.filter(id => id !== args.userId) })
                },
            },
        },
    }),
});

export const schemas = mergeSchemas({
    schemas: [mutationSchema, querySchema],
});
