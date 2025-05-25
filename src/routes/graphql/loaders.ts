import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

interface Context {
    prisma: PrismaClient;
}

export function createLoaders(context: Context) {
    const userLoader = new DataLoader(async (ids: readonly string[]) => {
        const users = await context.prisma.user.findMany({
            where: { id: { in: [...ids] } },
            include: {
                profile: {
                    include: {
                        memberType: true
                    }
                },
                posts: true,
                userSubscribedTo: {
                    include: { author: true }
                },
                subscribedToUser: {
                    include: { subscriber: true }
                }
            }
        });

        const userMap = new Map(users.map(user => [user.id, user]));
        return ids.map(id => userMap.get(id) || null);
    });

    const postLoader = new DataLoader(async (ids: readonly string[]) => {
        const posts = await context.prisma.post.findMany({
            where: { id: { in: [...ids] } }
        });

        const postMap = new Map(posts.map(post => [post.id, post]));
        return ids.map(id => postMap.get(id) || null);
    });

    const profileLoader = new DataLoader(async (ids: readonly string[]) => {
        const profiles = await context.prisma.profile.findMany({
            where: { id: { in: [...ids] } },
            include: {
                memberType: true
            }
        });

        const profileMap = new Map(profiles.map(profile => [profile.id, profile]));
        return ids.map(id => profileMap.get(id) || null);
    });

    const memberTypeLoader = new DataLoader(async (ids: readonly string[]) => {
        const memberTypes = await context.prisma.memberType.findMany({
            where: { id: { in: [...ids] } }
        });

        const memberTypeMap = new Map(memberTypes.map(memberType => [memberType.id, memberType]));
        return ids.map(id => memberTypeMap.get(id) || null);
    });

    return {
        userLoader,
        postLoader,
        profileLoader,
        memberTypeLoader
    };
} 