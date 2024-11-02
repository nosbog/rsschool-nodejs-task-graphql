import {  GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from "graphql";
import { User } from '@prisma/client';
import { Context } from "../../types/context.js";
import {PostType} from "./post.js";
import {ProfileType} from "./profile.js";
import {UUIDType} from "../../types/uuid.js";

export const UserType = new GraphQLObjectType({
    name: 'User',
    description: "This represent a User",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (obj: User, _args, context: Context) => {
                return await context.prisma.post.findMany({ where: { authorId: obj.id } })
            }
        },
        profile: {
            type: ProfileType,
            resolve: async (obj: User, _args, context: Context) => {
                return await context.prisma.profile.findUnique({ where: { userId: obj.id } })
            }
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async (obj: User, _args, context: Context) => {
                return context.prisma.user.findMany(
                    {
                        where: {
                            userSubscribedTo: {
                                some: {
                                    authorId: obj.id
                                }
                            }
                        }
                    });
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async (obj: User, _args, context: Context) => {
                return context.prisma.user.findMany(
                    {
                        where: {
                                subscribedToUser: {
                                    some: {
                                         subscriberId: obj.id
                                    }
                                }
                        }
                    });
            }
        }

    })
});
