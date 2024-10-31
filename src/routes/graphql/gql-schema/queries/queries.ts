import { GraphQLList, GraphQLObjectType } from 'graphql';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import DataLoader from 'dataloader';
import { Post, PrismaClient, Profile, MemberType } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import { MemberType as GQLMemberType, MemberTypeIdType } from '../types/memberType.js';
import { PostType } from '../types/post.js';
import { ProfileType } from '../types/profile.js';
import usersResolver from './resolvers/multipleRecords/users.resolver.js';
import memberTypesResolver from './resolvers/multipleRecords/memberTypes.resolver.js';
import postsResolver from './resolvers/multipleRecords/posts.resolver.js';
import profilesResolver from './resolvers/multipleRecords/profiles.resolver.js';
import userResolver from './resolvers/singleRecord/user.resolver.js';
import memberTypeResolver from './resolvers/singleRecord/memberType.resolver.js';
import postResolver from './resolvers/singleRecord/post.resolver.js';
import profileResolver from './resolvers/singleRecord/profile.resolver.js';

const queries = (
  prisma: PrismaClient,
  profilesLoader: DataLoader<string, Profile[], string>,
  postsLoader: DataLoader<string, Post[], string>,
  memberTypesLoader: DataLoader<string, MemberType, string>,
) =>
    new GraphQLObjectType({
        name: 'queries',
        fields: {

            // ---> multiple records

            users: {
                type: new GraphQLList(UserType),
                resolve: async (_parent, _args, _context, resolveInfo) => {
                  const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as ResolveTree;
                  const { fields } = simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, UserType);
                  return await usersResolver(fields, profilesLoader, postsLoader, prisma);
                },
            },
        
            memberTypes: {
                type: new GraphQLList(GQLMemberType),
                resolve: async () => await memberTypesResolver(prisma),
            },

            posts: {
                type: new GraphQLList(PostType),
                resolve: async () => await postsResolver(prisma),
            },

            profiles: {
                type: new GraphQLList(ProfileType),
                resolve: async () => await profilesResolver(memberTypesLoader, prisma),
            },

            // ---> single record

            user: {
                type: UserType,
                args: {
                    id: { type: UUIDType },
                },
                resolve: async (_parent, args) => await userResolver(args, prisma),
            },

            memberType: {
                type: GQLMemberType,
                args: {
                    id: { type: MemberTypeIdType },
                },
                resolve: async (_parent, args) => await memberTypeResolver(args, prisma),
            },

            post: {
                type: PostType,
                args: {
                    id: { type: UUIDType },
                },
                resolve: async (_parent, args) => await postResolver(args, prisma),
            },

            profile: {
                type: ProfileType,
                args: {
                    id: { type: UUIDType },
                },
                resolve: async (_parent, args) => await profileResolver(args, prisma),
            },
        },
    });

export default queries;
