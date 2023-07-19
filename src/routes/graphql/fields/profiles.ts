import {
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} from "graphql";
import {PrismaClient} from "@prisma/client";
import {UUIDType} from "../types/uuid.js";
import {MemberId, MemberType} from "./members.js";
import {Void} from "../types/void.js";

const prisma = new PrismaClient()

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        userId: {type: UUIDType},
        memberTypeId: {type: MemberId},
        memberType: {
            type: MemberType,
            resolve(parent: Record<string, string>) {
                return prisma.memberType.findUnique({
                    where: {
                        id: parent.memberTypeId
                    }
                })
            }
        }
    })
})

export const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        isMale: {type: new GraphQLNonNull(GraphQLBoolean)},
        yearOfBirth: {type: new GraphQLNonNull(GraphQLInt)},
        userId: {type: new GraphQLNonNull(UUIDType)},
        memberTypeId: {type: new GraphQLNonNull(MemberId)},
    })
})

export const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: () => ({
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberTypeId: {type: MemberId},
    })
})

export const profileQueryFields = {
    profile: {
        type: ProfileType,
        args: {id: {type: UUIDType}},
        resolve(parent, args: Record<string, string>) {
            const profile = prisma.profile.findUnique({
                where: {
                    id: args.id,
                },
            });
            if (profile === null) {
                return null;
            }
            return profile;
        }
    },
    profiles: {
        type: new GraphQLList(ProfileType),
        resolve() {
            return prisma.profile.findMany();
        }
    }
}

export const profileMutationFields = {
    createProfile: {
        type: ProfileType,
        args: {dto: {type: CreateProfileInput}},
        resolve(parent, args: {
            dto: {
                isMale: boolean,
                yearOfBirth: number,
                userId: string,
                memberTypeId: string
            }
        }) {
            return prisma.profile.create({
                data: args.dto,
            });
        },
    },
    deleteProfile: {
        type: Void,
        args: {id: {type: UUIDType}},
        async resolve(parent, args: { id: string }) {
            await prisma.profile.delete({
                where: {
                    id: args.id,
                },
            });
        }
    },
    changeProfile: {
        type: ProfileType,
        args: {
            id: {type: UUIDType},
            dto: {type: ChangeProfileInput}
        },
        resolve(parent, args: {
            id: string,
            dto: {
                isMale?: boolean,
                yearOfBirth?: number,
                userId?: string,
                memberTypeId?: string
            }
        }) {
            return prisma.profile.update({
                where: {id: args.id},
                data: args.dto,
            });
        }
    }
}
