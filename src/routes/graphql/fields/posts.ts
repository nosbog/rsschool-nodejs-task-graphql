import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {PrismaClient} from "@prisma/client";
import {UUIDType} from "../types/uuid.js";

const prisma = new PrismaClient()

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: UUIDType},
    })
})

export const postFields = {
    post: {
        type: PostType,
        args: {id: {type: UUIDType}},
        resolve(parent, args: Record<string, string>) {
            const post = prisma.post.findUnique({
                where: {
                    id: args.id,
                },
            });
            if (post === null) {
                return null;
            }
            return post;
        }
    },
    posts: {
        type: new GraphQLList(PostType),
        resolve() {
            return prisma.post.findMany();
        }
    }
}
