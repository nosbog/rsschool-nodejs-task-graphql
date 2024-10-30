import DataLoader from 'dataloader';
import { Post, Profile, PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { mutations } from './mutations/mutations.js';
import { queries } from './queries/queries.js';

const Schema = (
    prisma: PrismaClient,
    profileLoader: DataLoader<string, Profile, string>,
    postsLoader: DataLoader<string, Post[], string>) => {
    return new GraphQLSchema({
      query: queries(prisma, profileLoader, postsLoader),
      mutation: mutations(prisma),
    });
}

export default Schema;
