import DataLoader from 'dataloader';
import { MemberType, Post, Profile, PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import mutations from './mutations/mutations.js';
import queries from './queries/queries.js';

const Schema = (
    prisma: PrismaClient,
    profileLoader: DataLoader<string, Profile | null, string>,
    postsLoader: DataLoader<string, Post[], string>,
    memberTypeLoader: DataLoader<string, MemberType | null, string>) => {
    return new GraphQLSchema({
      query: queries(prisma, profileLoader, postsLoader, memberTypeLoader),
      mutation: mutations(prisma),
    });
}

export default Schema;
