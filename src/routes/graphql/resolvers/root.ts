import { UUIDType } from '../types/uuid.js';

function getRootResolvers(fastify) {
    const { prisma, httpErrors } = fastify;

    return {
        UUID: UUIDType,

        // Query
        memberTypes: async () => {
            return await prisma.memberType.findMany();
        },
        posts: async () => {
            return await prisma.post.findMany();
        },

        users: async (a, b, c, d, e) => {
            const users = await prisma.user.findMany({
                include: {
                    profile: true,
                    posts: true,
                    userSubscribedTo: true,
                    subscribedToUser: true,
                },
            });
            /*const allProfiles = await prisma.profile.findMany({
                where: {
                    id: {
                        in: users.filter(u => u.profile).map(u => u.profile.id),
                    }
                }
            });
            return users.map(user => ({
                ...user,
                //posts: await prisma.post.findMany({ id: user.posts })
                profile: allProfiles.find(p => p.id === user.profile.id) || {},
            }));*/
            return users.map((user) => ({
                ...user,
                userSubscribedTo: user.userSubscribedTo.map(el => ({ ...el, id: el.authorId })),
                subscribedToUser: user.subscribedToUser.map(el => ({ ...el, id: el.subscriberId })),
            }));
        },

        profiles: async () => {
            return await prisma.profile.findMany();
        },
        memberType: async ({ id }) => {
            const memberType = await prisma.memberType.findUnique({
                where: { id },
            });
            /*if (memberType === null) {
                throw httpErrors.notFound();
            }*/
            return memberType;
        },
        post: async ({ id }) => {
            const post = await prisma.post.findUnique({
                where: { id },
            });
            /*if (post === null) {
                throw httpErrors.notFound();
            }*/
            return post;
        },

        user: async ({ id }) => {
            const user = await prisma.user.findUnique({
                where: { id },
            });
            if (!user)
                return null;

            let subscriptionData = await prisma.subscribersOnAuthors.findMany({
                where: { subscriberId: user.id },
            });

            const userAuthors = (await prisma.user.findMany({
                where: {
                  id: {
                    in: subscriptionData.map((subscr) => subscr.authorId),
                  },
                },
            })).map(async (author) => {
                const authorSubscripions = await prisma.subscribersOnAuthors.findMany({
                    where: { authorId: author.id },
                });
                const subscribedToUser = await prisma.user.findMany({
                    where: {
                        id: {
                            in: authorSubscripions.map((subscr) => subscr.subscriberId),
                        },
                    },
                });
                return { ...author, subscribedToUser };
            });
            
            subscriptionData = await prisma.subscribersOnAuthors.findMany({
                where: { authorId: user.id },
            });
            
            const userSubscribers = (await prisma.user.findMany({
                where: {
                    id: {
                        in: subscriptionData.map((subscr) => subscr.subscriberId),
                    },
                },
            })).map(async (subscriber) => {
                const authorSubscripions = await prisma.subscribersOnAuthors.findMany({
                    where: { subscriberId: subscriber.id },
                });
                const userSubscribedTo = await prisma.user.findMany({
                    where: {
                        id: {
                            in: authorSubscripions.map((subscr) => subscr.authorId),
                        },
                    },
                });
                return { ...subscriber, userSubscribedTo };
            });
            
            const profile = await prisma.profile.findUnique({
                where: { userId: user.id },
            });
            
            const posts = await prisma.post.findMany({ where: { authorId: user.id } });
            
            return {
                ...user,
                profile: profile ? { ...profile, memberType: { id: profile.memberTypeId } } : null,
                posts,
                userSubscribedTo: [...userAuthors],
                subscribedToUser: [...userSubscribers],
            };
        },

        userWithNullProfile: async ({ id }) => {
            const user = await prisma.user.findUnique({
                where: {
                    id,
                    profile: null,
                },
            });
            /*if (user === null) {
                throw httpErrors.notFound();
            }*/
            return user;
        },

        profile: async ({ id }) => {
            const profile = await prisma.profile.findUnique({
                where: { id },
            });
            /*if (profile === null) {
                throw httpErrors.notFound();
            }*/
            return profile;
        },
        
        // Mutations
        createPost: async (req) => {
            return await prisma.post.create({
                data: req.body,
            });
        },
        createUser: async (req) => {
            console.log(req)
            return await prisma.user.create({
                data: req.body,
            });
        },
        createProfile: async (req) => {
            return await prisma.profile.create({
                data: req.body,
            });
        },
        deleteUser: async (req) => {
            return await prisma.user.delete({
                where: {
                    id: req.params.userId,
                },
            });
        },
    };
}

export default getRootResolvers;
