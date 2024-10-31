import { PrismaClient, Profile, MemberType } from '@prisma/client';
import DataLoader from 'dataloader';

async function profilesResolver(
    memberTypeLoader: DataLoader<string, MemberType | null, string>,
    prisma: PrismaClient
): Promise<Profile[]> {
    const profiles = await prisma.profile.findMany();
    return await Promise.all(profiles.map(async (profile) => ({
        ...profile,
        memberType: await memberTypeLoader.load(profile.memberTypeId),
    })));
}

export default profilesResolver;
