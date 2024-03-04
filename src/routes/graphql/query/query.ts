import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from '../types/profile.js';
import prismaClient from '../prisma-client/client.js';
import { MemberType, MemberTypes } from '../types/member-type.js';
import { User } from '../types/user.js';
import { Post } from '../types/post.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const Query: GraphQLObjectType = new GraphQLObjectType({
    name: 'query',

    fields: {
        profiles: {
            type: new GraphQLList(Profile),
            resolve: async () => await prismaClient.profile.findMany(),
        },
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async () => await prismaClient.memberType.findMany(),
        },
        memberType: {
            type: MemberType,
            args: {
                id: { 
                    type: new GraphQLNonNull(MemberTypes)
                },
            },
            resolve: async (_, { id }: { id: MemberTypeId }) => {
                return await prismaClient.memberType.findUnique({ 
                    where: { 
                        id 
                    }
                });
            }
        },
        users: {
            type: new GraphQLList(User),
            resolve: async () => await prismaClient.user.findMany(),
        },
        user: {
            type: User,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (_, { id }: { id: string }) =>
                await prismaClient.user.findUnique({
                    where: {
                        id
                    }
                }),
        },
        posts: {
            type: new GraphQLList(Post),
            resolve: async () => await prismaClient.post.findMany(),
        },
        post: {
            type: Post,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (_, { id }: { id: string }) => 
                await prismaClient.post.findUnique({
                    where: {
                        id
                    }
                }),
        },
        profile: {
            type: Profile,
            args: {
                id: {
                    type: new GraphQLNonNull(UUIDType)
                }
            },
            resolve: async (_, { id }: { id: string }) =>
                await prismaClient.profile.findUnique({
                    where: {
                        id
                    }
                }),
        },
    },
});