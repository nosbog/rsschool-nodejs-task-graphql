import {  GraphQLNonNull, GraphQLList } from "graphql";
import {UUIDType} from "../types/uuid.js";
import {Post} from "@prisma/client";
import { Context } from "../types/context.js";
import { profileType } from "./types/profile.js";

export const profileQueryType = {
    profile: {
        type: profileType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: Post, context: Context) => {
            return await context.prisma.profile.findUnique({ where: { id: args.id } })
        }
    },
    profiles: {
        type: new GraphQLList(profileType),
        resolve: async (_obj, _args, context: Context) => {
            return await context.prisma.profile.findMany()
        }
    }
}
