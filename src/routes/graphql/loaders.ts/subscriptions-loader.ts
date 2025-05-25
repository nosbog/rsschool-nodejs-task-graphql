import { PrismaClient, User } from "@prisma/client";
import DataLoader from "dataloader";

export const subscriptionsLoader = (prisma: PrismaClient) => ({
  // User subscriptions (who the user is subscribed to)
  userSubscribedTo: new DataLoader<string, User[]>(async (subscriberIds) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: [...subscriberIds] } },
      include: { author: true }
    });
    const map = subscriptions.reduce((acc, sub) => {
      acc.set(sub.subscriberId, [...(acc.get(sub.subscriberId) || []), sub.author]);

      return acc;
    }, new Map<string, User[]>());

    return subscriberIds.map(id => map.get(id) || []);
  }),

  // The user's subscribers (who subscribed to him)
  subscribedToUser: new DataLoader<string, User[]>(async (authorIds) => {
    const subscribers = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: [...authorIds] } },
      include: { subscriber: true }
    });
    const map = subscribers.reduce((acc, sub) => {
      acc.set(sub.authorId, [...(acc.get(sub.authorId) || []), sub.subscriber]);

      return acc;
    }, new Map<string, User[]>());
    
    return authorIds.map(id => map.get(id) || []);
  })
});
