import {GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {UUIDType} from "../types/uuid.js";
import {Void} from "../types/void.js";
import {dbClient} from "../index.js";

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: UUIDType},
    })
})

export const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(UUIDType)},
    })
})

export const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: () => ({
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: UUIDType},
    })
})


export const postQueryFields = {
    post: {
        type: PostType,
        args: {id: {type: UUIDType}},
        resolve(parent, args: Record<string, string>) {
            const post = dbClient.post.findUnique({
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
            return dbClient.post.findMany();
        }
    }
}

export const postMutationFields = {
    createPost: {
        type: PostType,
        args: {dto: {type: CreatePostInput}},
        resolve(parent, args: { dto: { title: string, content: string, authorId: string } }) {
            return dbClient.post.create({
                data: args.dto,
            })
        }
    },
    deletePost: {
        type: Void,
        args: {id: {type: UUIDType}},
        async resolve(parent, args: { id: string }) {
            await dbClient.post.delete({
                where: {
                    id: args.id,
                },
            });
        }
    },
    changePost: {
        type: PostType,
        args: {
            id: {type: UUIDType},
            dto: {type: ChangePostInput}
        },
        resolve(parent, args: { id: string, dto: { title?: string, content?: string, authorId?: string } }) {
            return dbClient.post.update({
                where: {id: args.id},
                data: args.dto,
            });
        }
    }
}
