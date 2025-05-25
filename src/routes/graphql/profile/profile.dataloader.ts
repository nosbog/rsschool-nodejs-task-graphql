import { PrismaClient } from '@prisma/client';
import { ProfileModel } from './profile.model.js';
import DataLoader from 'dataloader';

export const profileDataLoader = (prismaClient: PrismaClient) => {
  const data = new DataLoader(async (ids: Readonly<string[]>) => {
    const profiles: ProfileModel[] = await prismaClient.profile.findMany({
      where: { id: { in: ids as string[] } },
    });

    const dataMap: { [idx: string]: ProfileModel } = profiles.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    return ids.map((id) => dataMap[id]);
  });

  return data;
};

export const userProfileDataLoader = (prismaClient: PrismaClient) => {
  const data = new DataLoader(async (ids: Readonly<string[]>) => {
    const profiles: ProfileModel[] = await prismaClient.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    const dataMap: { [idx: string]: ProfileModel } = profiles.reduce((acc, curr) => {
      acc[curr.userId] = curr;
      return acc;
    }, {});

    return ids.map((id) => dataMap[id]);
  });

  return data;
};
