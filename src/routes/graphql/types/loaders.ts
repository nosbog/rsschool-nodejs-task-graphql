import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { PostBody, ProfileBody } from "../schemas.js";
import { Record } from "@prisma/client/runtime/library.js";

export function getLoaders(prisma: PrismaClient) {
    return {
        profileLoader: new DataLoader<string, ProfileBody | null>(async (userIds) => {
            const profiles: Record<string, ProfileBody> = {};
            const result: (ProfileBody | null)[] = [];

            const userProfiles = await prisma.profile.findMany({
                where: {
                    userId: {
                        in: [...userIds]
                    }
                }
            });
            userProfiles.forEach((p) => { profiles[p.userId] = p });
            userIds.forEach((userId, index) => {
                if (profiles[userId]) {
                    result[index] = profiles[userId];
                } else {
                    result[index] = null;
                }
            });
            console.log('result: ', result);
            return result;

        }),
        postsLoader: new DataLoader<string, PostBody[] | null>(async (userIds) => {
            const userPosts = await prisma.post.findMany({
                where: {
                    authorId: {
                        in: [...userIds]
                    }
                }
            });
            const result: Record<string, PostBody[]> = {};
            userIds.forEach(userId => {
                result[userId] = userPosts.filter(post => post.authorId === userId);
            });

            return userIds.map(userId => result[userId] ?? null);
        })
    };
}
