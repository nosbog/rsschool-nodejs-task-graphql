import {GraphQLEnumType, GraphQLObjectType, GraphQLFloat, GraphQLList} from "graphql/index.js";
import {MemberTypeId} from "../../../member-types/schemas.js";
import {GraphQLInt} from "graphql";
import {profileType} from "./profile.js";
import {MemberType} from "@prisma/client";
import {Context} from "node:vm";

export const memberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    description: 'Type of membership',
    values: {
        BASIC: { value: MemberTypeId.BASIC },
        BUSINESS: { value: MemberTypeId.BUSINESS },
    }
});

export const memberType = new GraphQLObjectType({
    name: 'Member',
    description: 'This represent a Member',
    fields: () => ({
            id: {type: memberTypeIdEnum},
            discount: {type: GraphQLFloat},
            postsLimitPerMonth: {type: GraphQLInt},
            profiles: {
                type: new GraphQLList(profileType),
                resolve: async (obj: MemberType, _args, context: Context) => {
                    return await context.prisma.profile.findMany({where: {memberTypeId: obj.id}})
                }
            }
        }
    )
})
