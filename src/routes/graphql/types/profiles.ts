import {
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Context, idFieldType } from './util.js';
import { Static } from '@sinclair/typebox';
import { profileSchema } from '../../profiles/schemas.js';
import { MemberTypeIdEnum, MemberTypeType } from './member-type.js';

export type Profile = Static<typeof profileSchema>;

const profileFields = {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
};

const profileFieldsPartial = {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
};

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        ...idFieldType,
        ...profileFields,
        memberType: {
            type: MemberTypeType,
            resolve: async ({ memberTypeId }: Profile, _: unknown, { loaders }: Context) => {
                return loaders.memberTypesLoader.load(memberTypeId);
            },
        },
    }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
        ...profileFields,
    },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        ...profileFieldsPartial,
    },
});