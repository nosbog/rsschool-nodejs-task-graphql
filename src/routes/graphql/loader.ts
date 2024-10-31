import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';
export const loader = (prisma: PrismaClient): DataLoader<string, User | null> => {
  return new DataLoader(async (keys) => {
    const users = await prisma.user.findMany({
      where: { id: { in: keys as string[] } },
    });

    const usersMap = new Map(users.map((user) => [user.id, user]));
    return keys.map((key) => usersMap.get(key) || null);
  });
};
