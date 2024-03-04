import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import prismaClient from '../prisma-client/client.js';
import { Post } from './post.js';

export const User: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: UUIDType
        },
        name: {
            type: GraphQLString
        },
        balance: {
            type: GraphQLFloat
        },
        profile: {
            type: Profile,
            resolve: async ({ id }: { id: string }) =>
                await prismaClient.profile.findUnique({
                    where: {
                        userId: id
                    }
                }),
        },

        posts: {
            type: new GraphQLList(Post),
            resolve: async ({ id }: { id: string }) =>
                await prismaClient.post.findMany({
                    where: {
                        authorId: id
                    }
                }),
        },

        userSubscribedTo: {
            type: new GraphQLList(User),
            resolve: async ({ id }: { id: string }) => {
                return await prismaClient.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                                subscriberId: id
                            }
                        }
                    },
                });
            },
        },

        subscribedToUser: {
            type: new GraphQLList(User),
            resolve: async ({ id }: { id: string }) => {
                return await prismaClient.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                authorId: id
                            }
                        }
                    }
                });
            },
        },
    }),
});