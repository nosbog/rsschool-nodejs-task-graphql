import {
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
} from 'graphql';
import { MemberTypeId, memberTypeSchema } from '../../member-types/schemas.js';
import { Static } from '@fastify/type-provider-typebox';

export type Member = Static<typeof memberTypeSchema>;
export const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: { value: MemberTypeId.BASIC },
        BUSINESS: { value: MemberTypeId.BUSINESS },
    },
});

export const memberTypesIdField = {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
};

const memberTypesFields = {
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
};

export const MemberTypeType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        ...memberTypesIdField,
        ...memberTypesFields,
    }),
});