import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Post } from '../types/posts.js';

export function initPostsLoader(db: PrismaClient) {
    return new DataLoader(async (ids: readonly string[]) => {
        const map: Record<string, Post[]> = {};
        const rows = await db.post.findMany({
            where: { authorId: { in: [...ids] } },
        });

        rows.forEach((it) => {
            const key = it.authorId;

            if (map[key]) {
                map[key].push(it);
            } else {
                map[key] = [it];
            }
        });

        return ids.map((id) => map[id] || []);
    });
}