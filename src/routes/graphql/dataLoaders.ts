import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createLoaders(prisma: PrismaClient) {
  return {
    membersLoader: new DataLoader(async (memberId: any) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          id: { in: Array.from(memberId) },
        },
      });
      const foundIds = memberId.map((id) =>
        memberTypes.find((memberTypes) => memberTypes.id === id),
      );
      return foundIds;
    }),
  };
}

/* export const membersLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (memberId: any) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: Array.from(memberId) },
      },
    });
    const sortedInIdsOrder = memberId.map((id) =>
      profiles.find((profile) => profile.userId === id),
    );

    return sortedInIdsOrder;
  });
};
 */
