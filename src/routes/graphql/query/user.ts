import {UserType} from "./types/user.js";
import {GraphQLNonNull, GraphQLList } from "graphql";
import {UUIDType} from "../types/uuid.js";
import {User} from "@prisma/client";
import { Context } from "../types/context.js"

export const userQueryType = {
    user: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: User, context: Context) => {
            return await context.prisma.user.findUnique({ where: { id: args.id } })
        }
    },
    users: {
        type: new GraphQLList(UserType),
        resolve: async (_obj, _args, context: Context) => {
            return await context.prisma.user.findMany()
        }
    }
}
