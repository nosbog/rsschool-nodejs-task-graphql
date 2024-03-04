import { Post } from "@prisma/client";
import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types/context.js";
import { PostType } from "./type.js";
import { UUIDType } from "../types/uuid.js";

type CreatePostArgs = {
  dto: Omit<Post, 'id'>  
};

type ChangePostArgs = {
  id: string,
  dto: Omit<Post, 'id'|'authorId'>
};

type DeletePostArgs = {
  id: string
};

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const createPost: GraphQLFieldConfig<void, Context, CreatePostArgs> = {
  type: PostType,
  args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
  resolve: async (_source, { dto }, { prisma }) => {
    await prisma.post.create({ data: dto });
  },
};

const changePost: GraphQLFieldConfig<void, Context, ChangePostArgs> = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) }, 
    dto: { type: new GraphQLNonNull(ChangePostInput) } 
  },
  resolve: async (_source, args, { prisma }) => {
    await prisma.post.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const deletePost: GraphQLFieldConfig<void, Context, DeletePostArgs> = {
  type: PostType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    await prisma.post.delete({ where: { id: id } });
  }
}

export const PostMutations = {
  createPost,
  changePost,
  deletePost
};