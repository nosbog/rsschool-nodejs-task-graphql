import { GraphQLList, GraphQLObjectType } from "graphql";
import {MemberType, MemberTypeId} from "./member-type.js";
import { PrismaClient } from '@prisma/client';

interface Context {
    prisma: PrismaClient;
}

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_: unknown, args: unknown, context: Context) => await context.prisma.memberType.findMany(),
        },
        memberType: {
            type: MemberType,
            args: {
                id: { type: MemberTypeId }
            },
            resolve: async (_: unknown, args: { id: string }, context: Context) => await context.prisma.memberType.findUnique({ where: { id: args.id } }),
        }
    }
})

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        
    }
})