import { FastifyInstance } from 'fastify';
import { Post } from '../types/entityTypes.js';

export const getAllPosts = async (fastify: FastifyInstance) => {
  const posts = await fastify.prisma.post.findMany();
  return posts;
};

export const getPost = async (id: string, fastify: FastifyInstance) => {
  const post = await fastify.prisma.post.findFirst({
    where: {
      id: id,
    },
  });
  return post;
};

export const createPost = async (post: Post, fastify: FastifyInstance) => {
  const { title, content, authorId } = post;

  const newPost = await fastify.prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  });

  return newPost;
};

export const updatePost = async (id: string, post: Post, fastify: FastifyInstance) => {
  const { title, content, authorId } = post;

  const newPost = await fastify.prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      authorId,
    },
  });

  return newPost;
};

export const deletePost = async (id: string, fastify: FastifyInstance) => {
  await fastify.prisma.post.delete({
    where: { id },
  });
  return null;
};
