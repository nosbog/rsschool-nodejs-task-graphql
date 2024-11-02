import {GraphQLNonNull, GraphQLString} from "graphql/index.js";
import {Context} from "../types/context.js";
import {UUIDType} from "../types/uuid.js";
import {Subscription} from "./types/subscribe.js";

export const subscribeMutationType = {
    subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
            authorId: { type: new GraphQLNonNull(UUIDType)  }
        },
        resolve: async (_parent: unknown, args: Subscription, context: Context)=> {
            const {userId, authorId} = args

            if (!userId || !authorId) {
                return "There are 2 required fields: userId, authorId."
            }

            try {
                await context.prisma.subscribersOnAuthors.create({
                    data: {
                        subscriberId: userId,
                        authorId: authorId,
                    },
                });

                return 'Successfully subscribed'
            } catch (e) {
                return 'User could not subscribe'
            }
        }
    },
    unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
            authorId: { type: new GraphQLNonNull(UUIDType)  }
        },
        resolve: async (_parent: unknown, args: Subscription,  context: Context)=> {
            const {userId, authorId} = args

            if (!userId || !authorId) {
                return "There are 2 required fields: userId, authorId."
            }

            try {
                await context.prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: userId,
                            authorId: authorId,
                        },
                    },
                });

                return 'Successfully unsubscribed'
            } catch (e) {
                return 'User could not unsubscribe'
            }

        }
    },
}
