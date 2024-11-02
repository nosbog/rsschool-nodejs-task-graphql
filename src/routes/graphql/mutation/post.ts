import {GraphQLString, GraphQLNonNull} from "graphql/index.js";
import {UUIDType} from "../types/uuid.js";
import {Post} from "@prisma/client";
import {Context} from "../types/context.js";
import {PostType} from "../query/types/post.js";
import {ChangePostInputType, ChangePostType, CreatePostInputType, CreatePostType, DeletePostType} from "./types/post.js";

export const postMutationType = {
    createPost: {
        type: new GraphQLNonNull(PostType),
        args: {
            dto: { type: new GraphQLNonNull(CreatePostInputType) }
        },
        resolve: async (_parent: unknown, args: CreatePostType, context: Context)=> {
            const {title, content, authorId} = args.dto;

            if (!title || !content || !authorId) {
                throw new Error('There are 3 required fields: title, content, authorId.')
            }

            const post: Omit<Post, 'id'> = {
                title,
                content,
                authorId,
            } ;

            try {
                return  await context.prisma.post.create({ data: post})
            } catch (e) {
                throw new Error('Post was not created')
            }

        }
    },
    changePost: {
        type: new GraphQLNonNull(PostType),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: new GraphQLNonNull(ChangePostInputType)}
        },
        resolve: async (_parent: unknown, args: ChangePostType, context: Context)=> {
            const { title, content } = args.dto;
            if (!title || !content || !args.id) {
                throw new Error( 'There are 3 required fields: title, content, id.')
            }

            const post: Pick<Post, 'title' | 'content'> = {
                title: args.dto.title,
                content: args.dto.content,
            };

            try {
               await context.prisma.post.update({
                    where: { id: args.id },
                    data: post,
                });

                return { ...post, id: args.id }
            } catch (e) {
                throw new Error('Post was not updated')
            }

        }
    },
    deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent: unknown, args: DeletePostType, context: Context) => {
            if (!args.id) {
                throw new Error('There is 1 required field - id.')
            }

            try {
                await context.prisma.post.delete({ where: { id: args.id } })
                return "Post successfully deleted"
            } catch (e) {
                throw new Error('Post was not deleted')
            }

        }
    },
}
