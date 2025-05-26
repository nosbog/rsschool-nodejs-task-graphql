/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType, MemberTypeId } from "./member-type.js";
import { UUIDType } from './uuid.js';
import { CreateProfile, ProfileType, UpdateProfile } from "./profile.js";
import { CreatePost, PostType, UpdatePost } from "./posts.js";
import { CreateUser, UpdateUser, UserType } from "./user.js";
import { Context, CreatePostInput, CreateProfileInput, CreateUserInput, IDArgs, IMemberType, IProfile, UpdatePostInput, UpdateProfileInput, UpdateUserInput } from "./interfaces.js";
import { PrismaType } from "./prisma.js";
import { Post, User } from "@prisma/client";

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_: unknown, _args: unknown, context: Context) => {
                return await context.prisma.memberType.findMany()
            }
        },
        memberType: {
            type: MemberType,
            args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
            resolve: async (_: unknown, args: IDArgs, context: Context): Promise<IMemberType | null> => {
                const memberType = await context.loaders.memberTypeLoader.load(args.id);
                return memberType ?? null;
            },
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (_: unknown, args: unknown, context: Context) => await context.prisma.profile.findMany(),
        },
        profile: {
            type: ProfileType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context): Promise<IProfile | null> => await context.loaders.profileLoader.load(args.id),
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (_: unknown, args: unknown, context: Context) => await context.prisma.post.findMany(),
        },
        post: {
            type: PostType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context): Promise<Post | null> => {
                const post = await context.loaders.postLoader.load(args.id) as Post | null;
                return post;
            },
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: async (_: unknown, args: unknown, context: Context) => await context.prisma.user.findMany(),
        },
        user: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context): Promise<User | null> => {
                const user = await context.loaders.userLoader.load(args.id) as User | null;
                return user;
            },
        },
        prisma: {
            type: PrismaType,
            resolve: (_, _args, context: Context) => context.prisma,
        },
        userPosts: {
            type: new GraphQLList(PostType),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => (await context.loaders.userLoader.load(args.id)).posts

        },
        subscribedToUser: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => (await context.loaders.userLoader.load(args.id)).userSubscribedTo

        },
        userSubscribedTo: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => (await context.loaders.userLoader.load(args.id)).userSubscribedTo

        },
        userProfile: {
            type: ProfileType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, args: IDArgs, context: Context) => (await context.loaders.userLoader.load(args.id)).profile
        }

    }
})

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createProfile: {
            type: ProfileType,
            args: { dto: { type: new GraphQLNonNull(CreateProfile) } },
            resolve: async (_, { dto }: { dto: CreateProfileInput }, context: Context) => {
                const profile = await context.prisma.profile.create({ data: dto });
                context.loaders.profileLoader.prime(profile.id, profile);
                return profile;
            },
        },
        changeProfile: {
            type: ProfileType,
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
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: IDArgs, context: Context) => {
                await context.prisma.profile.delete({ where: { id } });
                context.loaders.profileLoader.clear(id);
                return true;
            },
        },
        createPost: {
            type: PostType,
            args: { dto: { type: new GraphQLNonNull(CreatePost) } },
            resolve: async (_, { dto }: { dto: CreatePostInput }, context: Context) => {
                const post = await context.prisma.post.create({ data: dto });
                context.loaders.postLoader.prime(post.id, post);
                return post;
            },
        },
        changePost: {
            type: PostType,
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
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: IDArgs, context: Context) => {
                await context.prisma.post.delete({ where: { id } });
                context.loaders.postLoader.clear(id);
                return true;
            },
        },
        createUser: {
            type: UserType,
            args: { dto: { type: new GraphQLNonNull(CreateUser) } },
            resolve: async (_, { dto }: { dto: CreateUserInput }, context: Context) => {
                const user = await context.prisma.user.create({ data: dto });
                context.loaders.userLoader.prime(user.id, user);
                return user;
            },
        },
        changeUser: {
            type: UserType,
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
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: IDArgs, context: Context) => {
                await context.prisma.user.delete({ where: { id } });
                context.loaders.userLoader.clear(id);
                return true;
            },
        },
        subscribeTo: {
            type: GraphQLBoolean,
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
                    return true;
                }
                return false;
            }
        },
        unsubscribeFrom: {
            type: GraphQLBoolean,
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
                    return true;
                }
                return false;
            }
        }
    }
})