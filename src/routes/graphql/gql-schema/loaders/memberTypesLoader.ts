import { MemberType, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

function memberTypesLoader(prisma: PrismaClient) {
  return new DataLoader<string, MemberType[] | null>(async (profileIds) => {
    const profiles = await prisma.profile.findMany({
        where: {
            id: { in: profileIds?.length ? [...profileIds] : [] },
        },
    });
    const memberTypes = await prisma.memberType.findMany();
    return profileIds.map(profileId => {
        const profile = profiles.find(p => p.id === profileId) || null;
        if (!profile) return null;
        return memberTypes.find(memberType => memberType.id === profile.memberTypeId) || null;
    });
  });
}

export default memberTypesLoader;
