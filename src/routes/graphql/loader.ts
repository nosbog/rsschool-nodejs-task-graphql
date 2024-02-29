import { MemberType, PrismaClient, Profile } from '@prisma/client';
import DataLoader from 'dataloader';

export const memberLoader = (prisma: PrismaClient) => {
    return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<MemberType>> => {
        let membersArr = await prisma.memberType.findMany({
            where: { id: { in: keys as string[] | undefined } },
        });
        const map = new Map();
        membersArr.forEach((m) => map.set(m.id, m));
        const result = new Array<MemberType>();
        keys.forEach((key) => {
            result.push(map.get(key));
        });
        return result;
    });
};


export const profileLoader = (prisma: PrismaClient) => {
    return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<Profile>> => {
        const profilesArr = (await prisma.profile.findMany({
            where: { userId: { in: keys as string[] }}
        })) as Profile[];
        const profilesMap = new Map();
        profilesArr.forEach(p => profilesMap.set(p.userId, p));
        const array = new Array<Profile>();
        keys.forEach(k => array.push(profilesMap.get(k) as Profile));
        return array;
    });
};