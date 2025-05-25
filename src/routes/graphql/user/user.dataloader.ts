import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { UserModel } from './user.model.js';

export const userDataLoader = (prismaClient: PrismaClient) => {
  const data = new DataLoader(async (ids: Readonly<string[]>) => {
    const users: UserModel[] = await prismaClient.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    const usersByIds = ids.map((id) => users.find((user) => user.id === id));

    return usersByIds;
  });

  return data;
};
