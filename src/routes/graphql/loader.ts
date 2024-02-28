import { MemberType, PrismaClient } from '@prisma/client';
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