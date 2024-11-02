import {MemberType, MemberTypeIdEnum } from "./types/member.js";
import {GraphQLNonNull, GraphQLList } from "graphql";
import { Context } from '../types/context.js'

export const memberQueryType = {
    memberType: {
        type: MemberType,
        args: {
            id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: async (_obj, args: { id: string }, context: Context) => {
            return await context.prisma.memberType.findUnique({ where: { id: args.id } })
        }
    },
    memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_obj, _args, context: Context) => {
            return await context.prisma.memberType.findMany()
        }
    }
}
