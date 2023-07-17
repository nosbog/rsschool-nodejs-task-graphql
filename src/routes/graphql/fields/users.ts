import {GraphQLFloat, GraphQLList, GraphQLObjectType} from "graphql";
import {PrismaClient} from "@prisma/client";
import {UUIDType} from "../types/uuid.js";
import {ProfileType} from "./profiles.js";
import {PostType} from "./posts.js";

const prisma = new PrismaClient()

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: UUIDType},
        balance: {type: GraphQLFloat},
        profile: {
            type: ProfileType,
            resolve(parent: Record<string, string>) {
                const profile = prisma.profile.findUnique({
                    where: {
                        userId: parent.id,
                    },
                });
                if (profile === null) {
                    return null;
                }
                return profile;
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent) {
                return prisma.post.findMany({
                    where: {
                        authorId: parent.id,
                    },
                });
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve(parent) {
                return prisma.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                                subscriberId: parent.id,
                            },
                        },
                    },
                });
            }
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve(parent) {
                return prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                authorId: parent.id,
                            },
                        },
                    },
                });
            }
        }
    })
})

export const userFields = {
    user: {
        type: UserType,
        args: {id: {type: UUIDType}},
        async resolve(parent, args: Record<string, string>) {
            const user = await prisma.user.findUnique({
                where: {
                    id: args.id,
                },
            });
            if (user === null) {
                return null;
            }
            return user;
        }
    },
    users: {
        type: new GraphQLList(UserType),
        resolve() {
            return prisma.user.findMany();
        }
    }
}
