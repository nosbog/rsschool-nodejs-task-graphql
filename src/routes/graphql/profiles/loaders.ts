import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Profile } from '../types/profiles.js';

export function initProfilesLoader(db: PrismaClient) {
    return new DataLoader(async (ids: readonly string[]) => {
        const map: Record<string, Profile> = {};
        const profiles = await db.profile.findMany({
            where: { userId: { in: [...ids] } },
        });

        profiles.forEach((it) => {
            const key = it.userId;
            map[key] = it;
        });

        return ids.map((id) => map[id] || null);
    });
}