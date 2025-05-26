import { PrismaClient, User, Post, Profile, MemberType } from "@prisma/client";
import DataLoader from "dataloader";

export interface Context {
    prisma: PrismaClient;
    loaders: {
        userLoader: DataLoader<string, User & {
            profile?: (Profile & { memberType?: MemberType }) | null;
            posts?: Post[];
            userSubscribedTo?: { author: User }[];
            subscribedToUser?: { subscriber: User }[];
        }>;
        postLoader: DataLoader<string, Post>;
        profileLoader: DataLoader<string, Profile & { memberType?: MemberType }>;
        memberTypeLoader: DataLoader<string, MemberType>;
    };
}

export interface IDArgs {
    id: string;
}

export interface IMemberType {
    id: string,
    discount: number,
    postsLimitPerMonth: number,
}
// type TMemberTypeID = 'BASIC' |'BUSINESS';

export interface IProfile {
    isMale: boolean,
    yearOfBirth: number,
    memberTypeId: string,
}

export interface CreateProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
}

export interface UpdateProfileInput {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
}

export interface CreatePostInput {
    title: string,
    content: string,
    authorId: string,
}

export interface UpdatePostInput {
    title?: string;
    content?: string;
}

export interface CreateUserInput {
    name: string;
    balance: number;
}

export interface UpdateUserInput {
    name?: string;
    balance?: number;
}

export interface IPrisma {
    operationHistory: IOperationHistory[];
}
interface IOperationHistory {
    model: string;
    operation: string;
    args: string;
}