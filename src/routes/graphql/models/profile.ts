import { Static, Type } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { profileFields } from '../../profiles/schemas.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeIdEnum, MemberTypeType } from './memberType.js';

const profile = Type.Object(profileFields);

type ProfileType = Static<typeof profile>;

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberType: {
      type: MemberTypeType,
      resolve: async (parent: ProfileType, _args, { dataLoaders }: Context) => {
        return dataLoaders.membersLoader.load(parent.memberTypeId);
      },
    },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});
