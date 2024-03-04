import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Post } from '../types/post.js';
import prismaClient from '../prisma-client/client.js';
import { Static } from '@sinclair/typebox';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';
import { User } from '../types/user.js';
import { changeUserByIdSchema, createUserSchema } from '../../users/schemas.js';
import { Profile } from '../types/profile.js';
import { changeProfileByIdSchema, createProfileSchema } from '../../profiles/schemas.js';
import { changePostInput, createPostInput } from './post-mutations.js';
import { changeUserInput, createUserInput } from './user-mutations.js';
import { changeProfileInput, createProfileInput } from './profile-mutations.js';
import { UUIDType } from '../types/uuid.js';

export const Mutation: GraphQLObjectType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createPost: {
            type: Post,
            args: { dto: { type: new GraphQLNonNull(createPostInput) } },
            resolve: async (_, { dto }: { dto: Static<(typeof createPostSchema)['body']> }) => 
                await prismaClient.post.create({ data: dto }),
        },
        changePost: {
            type: Post,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(changePostInput) },
            },
            resolve: async (_, { id, dto }: { id: string; dto: Static<(typeof changePostByIdSchema)['body']> } ) => 
                await prismaClient.post.update({ where: { id }, data: dto }),
        },
        deletePost: {
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: { id: string }) => 
                !!(await prismaClient.post.delete({ where: { id } })),
        },
        createUser: {
            type: User,
            args: { dto: { type: new GraphQLNonNull(createUserInput) } },
            resolve: async (_, { dto }: { dto: Static<(typeof createUserSchema)['body']> }) => 
                await prismaClient.user.create({ data: dto }),
        },
        changeUser: {
            type: User,
            args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(changeUserInput) } },
            resolve: async (_, { id, dto }: { id: string; dto: Static<(typeof changeUserByIdSchema)['body']> }) => 
                await prismaClient.user.update({ where: { id }, data: dto }),
        },
        deleteUser: {
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: { id: string }) => 
                !!(await prismaClient.user.delete({ where: { id } })),
        },
        createProfile: {
            type: Profile,
            args: { dto: { type: new GraphQLNonNull(createProfileInput) } },
            resolve: async (_, { dto }: { dto: Static<(typeof createProfileSchema)['body']> }) => 
                await prismaClient.profile.create({ data: dto }),
        },
        changeProfile: {
            type: Profile,
            args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(changeProfileInput) }},
            resolve: async (_, { id, dto }: { id: string ; dto: Static<(typeof changeProfileByIdSchema)['body']> }) =>
                await prismaClient.profile.update({ where: { id }, data: dto }),
        },
        deleteProfile: {
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: { id: string }) => 
                !!(await prismaClient.profile.delete({ where: { id } })),
        },
        subscribeTo: {
            type: User,
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => 
                await prismaClient.user.update({
                    where: { id: userId },
                    data: { userSubscribedTo: { create: { authorId } } },
                }),
        },
        unsubscribeFrom: {
            type: GraphQLBoolean,
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => 
                !!(await prismaClient.subscribersOnAuthors.delete({
                    where: {
                    subscriberId_authorId: { subscriberId: userId, authorId: authorId } } },
                )
            ),
        },
    }),
});