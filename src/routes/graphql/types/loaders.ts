import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { ProfileBody } from "../schemas.js";
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
            return result;
        })
    };
}