import { PrismaClient, Post } from '@prisma/client';
import DataLoader from 'dataloader';

export const createPostLoaders = (prisma: PrismaClient) => {
  const postCache = new Map<string, Post | null>();
  let allPostsCache: Post[] | null = null;

  const allPostsLoader = new DataLoader<string, Post[]>(async () => {
    if (allPostsCache) return [allPostsCache];
    
    const posts = await prisma.post.findMany();
    allPostsCache = posts;
    
    posts.forEach(post => postCache.set(post.id, post));
    
    return [posts];
  });

  const postsByUserLoader = new DataLoader<string, Post[]>(async (userIds) => {

    const allPosts = await prisma.post.findMany({
      where: { authorId: { in: [...userIds] } },
    });

    allPosts.forEach(post => postCache.set(post.id, post));
    
    const postsByUser = new Map<string, Post[]>();
    allPosts.forEach(post => {
      const userPosts = postsByUser.get(post.authorId) || [];
      
      postsByUser.set(post.authorId, [...userPosts, post]);
    });

    return userIds.map(userId => postsByUser.get(userId) || []);
  });

  const postByIdLoader = new DataLoader<string, Post | null>(async (postIds) => {
    const cachedResults = postIds.map(id => postCache.get(id));
    
    if (cachedResults.every(result => result !== undefined)) {
      return cachedResults as Array<Post | null>;
    }

    const missingIds = postIds.filter((_, index) => cachedResults[index] === undefined);
    const newPosts = await prisma.post.findMany({
      where: { id: { in: missingIds } },
    });

    newPosts.forEach(post => postCache.set(post.id, post));
    missingIds.forEach(id => {
      if (!postCache.has(id)) postCache.set(id, null);
    });

    return postIds.map(id => postCache.get(id) || null);
  });

  return {
    allPosts: allPostsLoader,
    postsByUser: postsByUserLoader,
    postById: postByIdLoader,
  };
};