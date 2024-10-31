import { Profile, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

function profilesLoader(prisma: PrismaClient) {
  return new DataLoader<string, Profile[]>(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: userIds?.length ? [...userIds] : [] },
      },
      include: { memberType: true },
    });
    return userIds.map(userId => profiles.filter(profile => profile.userId === userId));
  });
}

export default profilesLoader;
