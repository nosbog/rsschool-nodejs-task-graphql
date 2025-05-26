import DataLoader from 'dataloader';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export function createDataLoaders(prisma: any) {
  // User DataLoader
  const userLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: [...userIds] }
      }
    });
    
    return userIds.map(id => users.find(user => user.id === id) || null);
  });

  // Profile DataLoader  
  const profileLoader = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: [...userIds] }
      }
    });
    
    return userIds.map(userId => profiles.find(profile => profile.userId === userId) || null);
  });

  // Posts DataLoader
  const postsLoader = new DataLoader(async (userIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: [...userIds] }
      }
    });
    
    return userIds.map(userId => posts.filter(post => post.authorId === userId));
  });

  // MemberType DataLoader
  const memberTypeLoader = new DataLoader(async (memberTypeIds: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: { in: [...memberTypeIds] }
      }
    });
    
    return memberTypeIds.map(id => memberTypes.find(mt => mt.id === id) || null);
  });

  // User Subscriptions DataLoader
  const userSubscriptionsLoader = new DataLoader(async (userIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: { in: [...userIds] }
      },
      include: {
        author: true
      }
    });
    
    return userIds.map(userId => 
      subscriptions
        .filter(sub => sub.subscriberId === userId)
        .map(sub => sub.author)
    );
  });

  // User Subscribers DataLoader  
  const userSubscribersLoader = new DataLoader(async (userIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: { in: [...userIds] }
      },
      include: {
        subscriber: true
      }
    });
    
    return userIds.map(userId => 
      subscriptions
        .filter(sub => sub.authorId === userId)
        .map(sub => sub.subscriber)
    );
  });

  return {
    userLoader,
    profileLoader,
    postsLoader,
    memberTypeLoader,
    userSubscriptionsLoader,
    userSubscribersLoader,
  };
}

export type DataLoaders = ReturnType<typeof createDataLoaders>;