// import { PrismaClient } from '@prisma/client';
import { Mutation, Query } from './types/main.js';
import { GraphQLSchema } from 'graphql';

function createSchema() {
    return new GraphQLSchema({
        query: Query,
        mutation: Mutation,
    });
}

export default createSchema;