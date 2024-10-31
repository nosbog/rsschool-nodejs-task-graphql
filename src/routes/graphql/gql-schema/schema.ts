import DataLoader from 'dataloader';
import { MemberType, Post, Profile, PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import mutations from './mutations/mutations.js';
import queries from './queries/queries.js';

const Schema = (
    prisma: PrismaClient,
    profilesLoader: DataLoader<string, Profile[], string>,
    postsLoader: DataLoader<string, Post[], string>,
    memberTypesLoader: DataLoader<string, MemberType[], string>) => {
    return new GraphQLSchema({
      query: queries(prisma, profilesLoader, postsLoader, memberTypesLoader),
      mutation: mutations(prisma),
    });
}

export default Schema;
