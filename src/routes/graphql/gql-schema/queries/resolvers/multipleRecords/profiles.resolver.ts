import { PrismaClient, Profile, MemberType } from '@prisma/client';
import DataLoader from 'dataloader';

async function profilesResolver(
    memberTypesLoader: DataLoader<string, MemberType[], string>,
    prisma: PrismaClient
): Promise<Profile[]> {
    const profiles = await prisma.profile.findMany();
    return await Promise.all(profiles.map(async (profile) => ({
        ...profile,
        memberType: await memberTypesLoader.load(profile.memberTypeId),
    })));
}

export default profilesResolver;
