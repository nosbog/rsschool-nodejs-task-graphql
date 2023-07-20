import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { FastifyInstance } from 'fastify';

// ProfileType
export const PostType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    authorId: {
      type: UUIDType,
    },
  }),
});

// ManyPostsType
export const ManyPostsType = new GraphQLList(PostType);

// Post args
interface PostTypeArgs {
  id: string;
}
const postTypeArgs = { id: { type: UUIDType } };

// Post resolver
const postTypeResolver = (_parent, args: PostTypeArgs, { prisma }: FastifyInstance) => {
  return prisma.post.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many Post resolver
const manyPostTypeResolver = (_parent, _args, { prisma }: FastifyInstance) => {
  return prisma.post.findMany();
};

// PostType Field
export const PostTypeField = {
  type: PostType,
  args: postTypeArgs,
  resolve: postTypeResolver,
};

// Many PostType Field
export const PostsTypeField = {
  type: ManyPostsType,
  resolve: manyPostTypeResolver,
};

// Mutations

// Create Post
const createPostDto = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  }),
});

const createPostArgs = {
  dto: {
    type: new GraphQLNonNull(createPostDto),
  },
};

interface CreatePostArgs {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

const createPostResolver = (_parent, args: CreatePostArgs, fastify: FastifyInstance) => {
  return fastify.prisma.post.create({
    data: args.dto,
  });
};

export const CreatePostField = {
  type: PostType,
  args: createPostArgs,
  resolve: createPostResolver,
};
