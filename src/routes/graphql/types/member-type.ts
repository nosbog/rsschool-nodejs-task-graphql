import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';
import { Profile } from './profile.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypes: GraphQLEnumType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        basic: {
            value: MemberTypeId.BASIC
        },
        business: {
            value: MemberTypeId.BUSINESS
        },
    },
});

export const MemberType: GraphQLObjectType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {
            type: MemberTypes
        },
        discount: {
            type: GraphQLFloat
        },
        postsLimitPerMonth: {
            type: GraphQLInt
        },
        profiles: {
            type: new GraphQLList(Profile)
        },
    }),
});