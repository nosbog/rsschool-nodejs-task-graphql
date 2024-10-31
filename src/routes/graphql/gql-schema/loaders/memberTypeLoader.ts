import { MemberType, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

function memberTypeLoader(prisma: PrismaClient) {
  return new DataLoader<string, MemberType | null>(async (profileIds) => {
    const profiles = await prisma.profile.findMany({
        where: {
            id: { in: profileIds?.length ? [...profileIds] : [] },
        },
    });
    const profileById = (profileId) => profiles.find(el => el.id === profileId);
    const memberTypes = await prisma.memberType.findMany();
    return profileIds.map(profileId =>
      memberTypes.find(memberType => memberType.id === profileById(profileId)?.memberTypeId) || null);
  });
}

export default memberTypeLoader;
