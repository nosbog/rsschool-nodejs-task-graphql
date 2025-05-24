import {
  changePostInputDto,
  Context,
  createPostInputDto,
  User,
} from '../ts-types.js';

export const getAllPosts = async (
  _parent: unknown,
  _args: unknown,
  { prisma }: Context,
) => {
  return prisma.post.findMany();
};

export const getPost = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma }: Context,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  return post;
};

export const createPost = async (
  _parent: unknown,
  { dto }: { dto: createPostInputDto },
  { prisma }: Context,
) => {
  const post = await prisma.post.create({
    data: dto,
  });
  return post;
};

export const updatePost = async (
  _parent: unknown,
  { dto, id }: { dto: changePostInputDto; id: string },
  { prisma }: Context,
) => {
  const post = await prisma.post.update({
    where: {
      id,
    },
    data: dto,
  });
  return post;
};

export const deletePost = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma }: Context,
) => {
  await prisma.post.delete({ where: { id } });
  return 'Deleted succesfully!';
};

export const getPostByUser = async (
  parent: User,
  _args: unknown,
  { prisma }: Context,
) => {
  const { id } = parent;
  const post = await prisma.post.findMany({
    where: {
      authorId: id,
    },
  });
  return post;
};
