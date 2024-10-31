import { GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './memberType.js';

export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberType: { type: MemberType },
    }),
});

export const CreateProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: GraphQLString },
        memberTypeId: { type: GraphQLString },
    }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: GraphQLString },
    },
});
  