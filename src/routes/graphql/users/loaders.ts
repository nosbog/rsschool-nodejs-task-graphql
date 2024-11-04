import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { SubscriptionToUser, UserSubscription } from '../types/users.js';

export function initSubscriptionsToUsersLoader(db: PrismaClient) {
    return new DataLoader(async (ids: readonly string[]) => {
        const map: Record<string, UserSubscription[]> = {};
        const rows = await db.user.findMany({
            where: {
                userSubscribedTo: {
                    some: {
                        authorId: {
                            in: [...ids],
                        },
                    },
                },
            },
            include: {
                userSubscribedTo: true,
            },
        });

        rows.forEach((it1) => {
            it1.userSubscribedTo.forEach((it2) => {
                const key = it2.authorId;

                if (map[key]) {
                    map[key].push(it1);
                } else {
                    map[key] = [it1];
                }
            });
        });

        return ids.map((id) => map[id] || []);
    });
}

export function initUsersSubscriptionsLoader(db: PrismaClient) {
    return new DataLoader(async (ids: readonly string[]) => {
        const map: Record<string, SubscriptionToUser[]> = {};
        const rows = await db.user.findMany({
            where: {
                subscribedToUser: {
                    some: {
                        subscriberId: {
                            in: [...ids],
                        },
                    },
                },
            },
            include: {
                subscribedToUser: true,
            },
        });

        rows.forEach((it1) => {
            it1.subscribedToUser.forEach((it2) => {
                const key = it2.subscriberId;

                if (map[key]) {
                    map[key].push(it1);
                } else {
                    map[key] = [it1];
                }
            });
        });

        return ids.map((id) => map[id] || []);
    });
}