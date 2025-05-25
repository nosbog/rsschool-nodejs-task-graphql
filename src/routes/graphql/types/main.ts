import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType, MemberTypeId } from "./member-type.js";
import { PrismaClient, User as PrismaUser, Post as PrismaPost, Profile as PrismaProfile, MemberType as PrismaMemberType } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { CreateProfile, Profile, UpdateProfile } from "./profile.js";
import { CreatePost, Post, UpdatePost } from "./posts.js";
import { CreateUser, UpdateUser, User } from "./user.js";
import DataLoader from 'dataloader';

interface Context {
    prisma: PrismaClient;
    loaders: {
        userLoader: DataLoader<string, PrismaUser & {
            profile?: PrismaProfile | null;
            posts?: PrismaPost[];
            userSubscribedTo?: { author: PrismaUser }[];
            subscribedToUser?: { subscriber: PrismaUser }[];
        }>;
        postLoader: DataLoader<string, PrismaPost>;
        profileLoader: DataLoader<string, PrismaProfile & { memberType?: PrismaMemberType }>;
        memberTypeLoader: DataLoader<string, PrismaMemberType>;
    };
}

interface IDArgs {
    id: string;
}

interface CreateProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
}

interface UpdateProfileInput {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
}

interface CreatePostInput {
    title: string,
    content: string,
    authorId: string,
}

interface UpdatePostInput {
    title?: string;
    content?: string;
}

interface CreateUserInput {
    name: string;
    balance: number;
}

interface UpdateUserInput {
    name?: string;
    balance?: number;
}

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
            resolve: async (_: unknown, args: unknown, context: Context) => await context.prisma.memberType.findMany(),
        },
        memberType: {
            type: new GraphQLNonNull(MemberType),
            args: { id: { type: MemberTypeId } },
            resolve: async (_: unknown, args: IDArgs, context: Context) => await context.loaders.memberTypeLoader.load(args.id),
        },
        profiles: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
            resolve: (_, args, context) => context.prisma.profile.findMany(),
        },
        profile: {
            type: new GraphQLNonNull(Profile),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => await context.loaders.profileLoader.load(args.id),
        },
        posts: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
            resolve: (_, args, context) => context.prisma.post.findMany(),
        },
        post: {
            type: new GraphQLNonNull(Post),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => await context.loaders.postLoader.load(args.id),
        },
        users: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
            resolve: (_, args, context) => context.prisma.user.findMany(),
        },
        user: {
            type: new GraphQLNonNull(User),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => await context.loaders.userLoader.load(args.id),
        },
    }
})

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createProfile: {
            type: new GraphQLNonNull(Profile),
            args: { dto: { type: new GraphQLNonNull(CreateProfile) } },
            resolve: async (_, { dto }: { dto: CreateProfileInput }, context: Context) => {
                const profile = await context.prisma.profile.create({ data: dto });
                context.loaders.profileLoader.prime(profile.id, profile);
                return profile;
            },
        },
        changeProfile: {
            type: new GraphQLNonNull(Profile),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(UpdateProfile) }
            },
            resolve: async (_, { id, dto }: IDArgs & { dto: UpdateProfileInput }, context: Context) => {
                const profile = await context.prisma.profile.update({ where: { id }, data: dto });
                context.loaders.profileLoader.prime(profile.id, profile);
                return profile;
            },
        },
        deleteProfile: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: IDArgs, context: Context) => {
                await context.prisma.profile.delete({ where: { id } });
                context.loaders.profileLoader.clear(id);
                return true;
            },
        },
        createPost: {
            type: new GraphQLNonNull(Post),
            args: { dto: { type: new GraphQLNonNull(CreatePost) } },
            resolve: async (_, { dto }: { dto: CreatePostInput }, context: Context) => {
                const post = await context.prisma.post.create({ data: dto });
                context.loaders.postLoader.prime(post.id, post);
                return post;
            },
        },
        changePost: {
            type: new GraphQLNonNull(Post),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(UpdatePost) }
            },
            resolve: async (_, { id, dto }: IDArgs & { dto: UpdatePostInput }, context: Context) => {
                const post = await context.prisma.post.update({ where: { id }, data: dto });
                context.loaders.postLoader.prime(post.id, post);
                return post;
            },
        },
        deletePost: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: IDArgs, context: Context) => {
                await context.prisma.post.delete({ where: { id } });
                context.loaders.postLoader.clear(id);
                return true;
            },
        },
        createUser: {
            type: new GraphQLNonNull(User),
            args: { dto: { type: new GraphQLNonNull(CreateUser) } },
            resolve: async (_, { dto }: { dto: CreateUserInput }, context: Context) => {
                const user = await context.prisma.user.create({ data: dto });
                context.loaders.userLoader.prime(user.id, user);
                return user;
            },
        },
        changeUser: {
            type: new GraphQLNonNull(User),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(UpdateUser) }
            },
            resolve: async (_, { id, dto }: IDArgs & { dto: UpdateUserInput }, context: Context) => {
                const user = await context.prisma.user.update({ where: { id }, data: dto });
                context.loaders.userLoader.prime(user.id, user);
                return user;
            },
        },
        deleteUser: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: IDArgs, context: Context) => {
                await context.prisma.user.delete({ where: { id } });
                context.loaders.userLoader.clear(id);
                return true;
            },
        },
        subscribeTo: {
            type: new GraphQLNonNull(User),
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, context: Context) => {
                await context.prisma.subscribersOnAuthors.create({
                    data: {
                        subscriberId: userId,
                        authorId: authorId
                    }
                });
                const user = await context.prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    context.loaders.userLoader.prime(user.id, user);
                }
                return user;
            }
        },
        unsubscribeFrom: {
            type: new GraphQLNonNull(User),
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, context: Context) => {
                await context.prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: userId,
                            authorId: authorId
                        }
                    }
                });
                const user = await context.prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    context.loaders.userLoader.prime(user.id, user);
                }
                return user;
            }
        }
    }
})