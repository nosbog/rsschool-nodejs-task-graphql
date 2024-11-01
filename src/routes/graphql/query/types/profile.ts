import {   GraphQLObjectType, GraphQLBoolean, GraphQLInt } from "graphql";
import { UUIDType } from "../../types/uuid.js";
import {memberType, memberTypeIdEnum} from "./member.js";
import {userType} from "./user.js";
import { Profile } from '@prisma/client';
import { Context } from "../../types/context.js";

export const profileType = new GraphQLObjectType({
    name: 'Profile',
    description: "This represent a Profile",
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: memberTypeIdEnum },
        userId: { type: UUIDType },
        user: {
            type: userType,
            resolve: async (obj: Profile, _args, context: Context) => {
                return await context.prisma.user.findUnique({ where: { id: obj.userId } })
            }
        },
        memberType: {
            type: memberType,
            resolve: async (obj: Profile, _args, context: Context) => {
                return await context.prisma.memberType.findUnique({ where: { id: obj.memberTypeId } })
            }
        }
    })
});
