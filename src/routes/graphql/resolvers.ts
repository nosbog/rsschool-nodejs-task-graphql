import { FastifyInstance } from 'fastify';

export const createResolvers = (fastify: FastifyInstance) => {
    const { prisma } = fastify;

    return {
        memberTypes: async () => {
            return prisma.memberType.findMany();
        },
        memberType: async (args: { id: 'BASIC' | 'BUSINESS' }) => {
            const { id } = args;

            return prisma.memberType.findUnique({
                where: { id }
            });
        },
        users: async () => {
            return prisma.user.findMany({
                include: {
                    profile: {
                        include: {
                            memberType: true,
                        },
                    },
                    posts: true,
                    userSubscribedTo: {
                        include: {
                            subscriber: {
                                include: {
                                    subscribedToUser: true,
                                }
                            }
                        }
                    },
/*                    userSubscribedTo: {
                        include: {
                            subscriber: {
                                include: {
                                    subscribedToUser: true,
                                }
                            }
                        }
                    },
                    subscribedToUser: {
                        include: {
                            subscriber: {
                                include: {
                                    userSubscribedTo: true,
                                }
                            }
                        }
                    }*/
                }
            });
        },
        user: async (args: { id: string }) => {
            const { id } = args;

            console.log('resolvers id', id);

            const result = await prisma.user.findUnique({
                where: { id },
                include: {
                    profile: {
                        include: {
                            memberType: true,
                        },
                    },
                    posts: true,
                    userSubscribedTo: {
                        include: {
                            subscriber: true
                        }
                    },
/*                    userSubscribedTo: {
                        include: {
                            subscriber: {
                                include: {
                                    subscribedToUser: true,
                                }
                            }
                        }
                    },
                    subscribedToUser: {
                        include: {
                            subscriber: {
                                include: {
                                    userSubscribedTo: true,
                                }
                            }
                        }
                    }*/
                }
            });
            return result;
        },
        posts: async () => {
            return prisma.post.findMany();
        },
        post: async (args: { id: string }) => {
            const { id } = args;

            return prisma.post.findUnique({
                where: { id },
            });
        },
        profiles: async () => {
            return prisma.profile.findMany();
        },
        profile: async (args: { id: string }) => {
            const { id } = args;

            return prisma.profile.findUnique({
                where: { id },
                include: { memberType: true },
            });
        },
    };
};
