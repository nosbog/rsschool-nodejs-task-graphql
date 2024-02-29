import { MemberType, PrismaClient, Profile, Post } from '@prisma/client';
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


export const postLoader = (prisma: PrismaClient) => {
    return new DataLoader(async (keys: Readonly<string[]>): Promise<Array<Post[]>> => {
            const posts: Array<Post> = await prisma.post.findMany({ where: {
                    authorId: { in: keys as string[] | undefined } }});
            const authorMap = new Map();
            posts.forEach(p => {
                const authorArray = authorMap.get(p.authorId) ? authorMap.get(p.authorId) : [];
                authorArray.push(p);
                authorMap.set(p.authorId, authorArray);
            });
            const array = new Array<Post[]>();
            keys.forEach(k => {
                array.push(authorMap.get(k) as Post[]);
            });
            return array;
        });
};


export const userSubscribedToLoader = (prisma: PrismaClient) => {
    return new DataLoader(async (keys: Readonly<string[]>) => {
        let userSubscribedToArr = await prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: { in: keys as string[] | undefined } },
            select: { author: true, subscriberId: true },
        });
        const userSubscribedToMap = new Map();
        userSubscribedToArr.forEach(u => {
            let subscriptionsArray = userSubscribedToMap.get(u) ? userSubscribedToMap.get(u) : [];
            subscriptionsArray.push(u.author);
            userSubscribedToMap.set(u.subscriberId, subscriptionsArray);
        });
        const array = new Array<any>();
        keys.forEach(k => array.push(userSubscribedToMap.get(k)));
        return array;
    });
};


export const subscribedToUserLoader = (prisma: PrismaClient) => {
    return new DataLoader(async (keys: Readonly<string[]>) => {
        const subscribedToUserArr = await prisma.subscribersOnAuthors.findMany({
            where: { authorId: { in: keys as string[] | undefined }},
            select: { subscriber: true, authorId: true } });
        const subscribedToUserMap = new Map();
        subscribedToUserArr.forEach(u => {
            let subscriptionsArr = subscribedToUserMap.get(u.authorId) ? subscribedToUserMap.get(u) : [];
            subscriptionsArr.push(u.subscriber);
            subscribedToUserMap.set(u.authorId, subscriptionsArr);
        });
        const array = new Array<any>();
        keys.forEach((key) => array.push(subscribedToUserMap.get(key)));
        return array;
    });
};