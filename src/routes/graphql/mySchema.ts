import { PrismaClient } from '@prisma/client';
import { Mutation, Query } from './types/main.js';
import { GraphQLSchema } from 'graphql';

function createSchema(prisma: PrismaClient) {
    return new GraphQLSchema({
        query: Query,
        mutation: Mutation,
    });
}

export default createSchema;