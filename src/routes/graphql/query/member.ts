import {memberType, memberTypeIdEnum } from "./types/member.js";
import {GraphQLNonNull, GraphQLList } from "graphql";
import { Context } from '../types/context.js'
import { MemberType } from "@prisma/client";

export const memberQueryType = {
    memberType: {
        type: memberType,
        args: {
            id: { type: new GraphQLNonNull(memberTypeIdEnum) },
        },
        resolve: async (_obj, args: MemberType, context: Context) => {
            return await context.prisma.memberType.findUnique({ where: { id: args.id } })
        }
    },
    memberTypes: {
        type: new GraphQLList(memberType),
        resolve: async (_obj, _args, context: Context) => {
            return await context.prisma.memberType.findMany()
        }
    }
}
