import {  GraphQLNonNull, GraphQLList } from "graphql";
import {PostType} from "./types/post.js";
import {UUIDType} from "../types/uuid.js";
import {Post} from "@prisma/client";
import { Context } from "../types/context.js";

export const postQueryType = {
    post: {
        type: PostType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: Post, context: Context) => {
            return await context.prisma.post.findUnique({ where: { id: args.id } })
        }
    },
    posts: {
        type: new GraphQLList(PostType),
        resolve: async (_obj, _args, context: Context) => {
            return await context.prisma.post.findMany()
        }
    }
}
