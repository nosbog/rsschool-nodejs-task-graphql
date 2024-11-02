import {GraphQLInputObjectType, GraphQLFloat, GraphQLString} from "graphql/type/index.js";
import { UUIDType } from "../../types/uuid.js";
import {UUID} from "node:crypto";
import {MemberTypeId} from "../../../member-types/schemas.js";
import {GraphQLBoolean, GraphQLInt} from "graphql";
import {MemberTypeIdEnum} from "../../query/types/member.js";
import {GraphQLNonNull} from "graphql/index.js";


export const CreateProfileInputType = new GraphQLInputObjectType({
    name: "CreateProfileInput",
    description: "Creates a new profile",
    fields: {
        isMale: { type: new GraphQLNonNull(GraphQLBoolean)},
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    }
})

export const ChangeProfileInputType = new GraphQLInputObjectType({
    name: "ChangeProfileInput",
    description: "Change a existing profile",
    fields: {
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    }
})

export type CreateProfileType =  {
    dto: {
        isMale: boolean
        yearOfBirth: number
        userId: UUID
        memberTypeId: MemberTypeId
    }
}


export type ChangeProfileType = {
    id: UUID,
    dto: {
        isMale: boolean
        yearOfBirth: number
        memberTypeId: MemberTypeId
    }
}

export type DeleteProfileType =  {
    id: UUID
}
