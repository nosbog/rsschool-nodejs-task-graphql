import {GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType} from "graphql";
import {PrismaClient} from "@prisma/client";
import {UUIDType} from "../types/uuid.js";
import {MemberId, MemberType} from "./members.js";

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

export const profileFields = {
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
