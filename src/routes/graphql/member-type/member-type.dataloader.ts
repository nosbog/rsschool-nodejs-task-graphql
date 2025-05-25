import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeModel } from './member-type.model.js';

export const memberTypeDataLoader = (prismaClient: PrismaClient) => {
  const data = new DataLoader(async (ids: Readonly<string[]>) => {
    const memberTypes: MemberTypeModel[] = await prismaClient.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });

    const dataMap: { [idx: string]: MemberTypeModel } = memberTypes.reduce(
      (acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {},
    );

    return ids.map((id) => dataMap[id]);
  });

  return data;
};
