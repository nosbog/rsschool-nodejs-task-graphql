import {GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType} from "graphql";
import {UUIDType} from "../types/uuid.js";
import {ProfileType} from "./profiles.js";
import {PostType} from "./posts.js";
import {Void} from "../types/void.js";
import {dbClient} from "../index.js";

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: UUIDType},
        balance: {type: GraphQLFloat},
        profile: {
            type: ProfileType,
            async resolve(parent: Record<string, string>) {
                const profile = await dbClient.profile.findUnique({
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
                return dbClient.post.findMany({
                    where: {
                        authorId: parent.id,
                    },
                });
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve(parent) {
                return dbClient.user.findMany({
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
                return dbClient.user.findMany({
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

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: {type: new GraphQLNonNull(UUIDType)},
        balance: {type: new GraphQLNonNull(GraphQLFloat)},
    })
})

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: () => ({
        name: {type: UUIDType},
        balance: {type: GraphQLFloat},
    })
})

export const userQueryFields = {
    user: {
        type: UserType,
        args: {id: {type: UUIDType}},
        async resolve(parent, args: Record<string, string>) {
            const user = await dbClient.user.findUnique({
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
            return dbClient.user.findMany();
        }
    }
}

export const userMutationFields = {
    createUser: {
        type: UserType,
        args: {dto: {type: CreateUserInput}},
        resolve(parent, args: { dto: { name: string, balance: number } }) {
            return dbClient.user.create({
                data: args.dto,
            });
        }
    },
    deleteUser: {
        type: Void,
        args: {id: {type: UUIDType}},
        async resolve(parent, args: { id: string }) {
            await dbClient.user.delete({
                where: {
                    id: args.id,
                },
            });
        }
    },
    changeUser: {
        type: UserType,
        args: {
            id: {type: UUIDType},
            dto: {type: ChangeUserInput}
        },
        resolve(parent, args: { id: string, dto: { name?: string, balance?: number } }) {
            return dbClient.user.update({
                where: {id: args.id},
                data: args.dto,
            });
        }
    },
    subscribeTo: {
        type: UserType,
        args: {
            userId: {type: UUIDType},
            authorId: {type: UUIDType}
        },
        resolve(parent, args: { userId: string, authorId: string }) {
            return dbClient.user.update({
                where: {
                    id: args.userId,
                },
                data: {
                    userSubscribedTo: {
                        create: {
                            authorId: args.authorId,
                        },
                    },
                },
            });
        }
    },
    unsubscribeFrom: {
        type: Void,
        args: {
            userId: {type: UUIDType},
            authorId: {type: UUIDType}
        },
        async resolve(parent, args: { userId: string, authorId: string }) {
            await dbClient.subscribersOnAuthors.delete({
                where: {
                    subscriberId_authorId: {
                        subscriberId: args.userId,
                        authorId: args.authorId,
                    },
                },
            });
        }
    },
}
