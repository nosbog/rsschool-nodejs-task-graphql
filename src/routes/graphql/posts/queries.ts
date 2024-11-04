import { GraphQLList, GraphQLNonNull } from 'graphql';

import { Context, idFieldType } from '../types/util.js';
import { PostType } from '../types/posts.js';

export const PostQueries = {
    post: {
        type: PostType,
        args: {
            ...idFieldType,
        },
        resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
            return db.post.findUnique({ where: { id } });
        },
    },
    posts: {
        type: new GraphQLNonNull(new GraphQLList(PostType)),
        resolve: async (_: unknown, __: unknown, { db }: Context) => {
            return db.post.findMany();
        },
    },
};