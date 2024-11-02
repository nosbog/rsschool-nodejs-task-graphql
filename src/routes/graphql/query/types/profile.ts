import {   GraphQLObjectType, GraphQLBoolean, GraphQLInt } from "graphql";
import { UUIDType } from "../../types/uuid.js";
import {MemberType, MemberTypeIdEnum} from "./member.js";
import {UserType} from "./user.js";
import { Profile } from '@prisma/client';
import { Context } from "../../types/context.js";

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    description: "This represent a Profile",
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeIdEnum },
        userId: { type: UUIDType },
        user: {
            type: UserType,
            resolve: async (obj: Profile, _args, context: Context) => {
                return await context.prisma.user.findUnique({ where: { id: obj.userId } })
            }
        },
        memberType: {
            type: MemberType,
            resolve: async (obj: Profile, _args, context: Context) => {
                return await context.prisma.memberType.findUnique({ where: { id: obj.memberTypeId } })
            }
        }
    })
});
