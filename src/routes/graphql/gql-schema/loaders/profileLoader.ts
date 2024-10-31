import { Profile, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

function profileLoader(prisma: PrismaClient) {
  return new DataLoader<string, Profile | null>(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: userIds?.length ? [...userIds] : [] },
      },
      include: { memberType: true },
    });
    return userIds.map(userId => profiles.find(profile => profile.userId === userId) || null);
  });
}

export default profileLoader;
