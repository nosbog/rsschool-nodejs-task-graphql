import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypes, MemberType } from './member-type.js';
import prismaClient from '../prisma-client/client.js';

export const Profile: GraphQLObjectType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {
            type: UUIDType
        },
        isMale: {
            type: GraphQLBoolean
        },
        yearOfBirth: {
            type: GraphQLInt
        },
        userId: {
            type: UUIDType
        },
        memberTypeId: {
            type: MemberTypes
        },
        memberType: {
            type: MemberType,
            resolve: async ({ memberTypeId }: { memberTypeId: string }) => 
                await prismaClient.memberType.findUnique({
                    where: {
                        id: memberTypeId
                    }
                }),
        },
    }),
});