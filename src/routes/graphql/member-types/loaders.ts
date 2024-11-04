import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Member } from '../types/member-type.js';

export function initMemberTypesLoader(db: PrismaClient) {
    return new DataLoader(async (ids: readonly string[]) => {
        const map: Record<string, Member> = {};
        const rows = await db.memberType.findMany({
            where: { id: { in: [...ids] } },
        });

        rows.forEach((it) => {
            const key = it.id;
            map[key] = it;
        });

        return ids.map((id) => map[id] || null);
    });
}