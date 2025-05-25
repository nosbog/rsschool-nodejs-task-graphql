import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { PostModel } from './post.model.js';

export const postDataLoader = (prismaClient: PrismaClient) => {
  const data = new DataLoader(async (ids: Readonly<string[]>) => {
    const posts: PostModel[] = await prismaClient.post.findMany({
      where: { id: { in: ids as string[] } },
    });

    const dataMap: { [idx: string]: PostModel } = posts.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    return ids.map((id) => dataMap[id]);
  });

  return data;
};

export const userPostsDataLoader = (prismaClient: PrismaClient) => {
  const data = new DataLoader(async (ids: Readonly<string[]>) => {
    const posts: PostModel[] = await prismaClient.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    return ids.map((id) => posts.filter((post) => post.authorId === id));
  });

  return data;
};
