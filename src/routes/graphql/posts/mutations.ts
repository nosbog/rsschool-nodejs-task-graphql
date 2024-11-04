import { GraphQLNonNull } from 'graphql';
import { Static } from '@sinclair/typebox';

import { Context, idFieldType } from '../types/util.js';
import { ChangePostInput, CreatePostInput, PostType } from '../types/posts.js';
import { createPostSchema } from '../../posts/schemas.js';
import { UUIDType } from '../types/uuid.js';

export const PostMutations = {
    createPost: {
        type: new GraphQLNonNull(PostType),
        args: { dto: { type: CreatePostInput } },
        resolve: async (
            _: unknown,
            { dto: data }: { dto: Static<(typeof createPostSchema)['body']> },
            { db }: Context,
        ) => {
            return db.post.create({ data });
        },
    },
    changePost: {
        type: new GraphQLNonNull(PostType),
        args: { ...idFieldType, dto: { type: ChangePostInput } },
        resolve: async (
            _: unknown,
            { id, dto: data }: { id: string; dto: Static<(typeof createPostSchema)['body']> },
            { db }: Context,
        ) => {
            return db.post.update({ where: { id }, data });
        },
    },
    deletePost: {
        type: UUIDType,
        args: { ...idFieldType },
        resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
            await db.post.delete({ where: { id } });
            return id;
        },
    },
};