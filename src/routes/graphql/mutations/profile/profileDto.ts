import { Static } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import {
  changeProfileByIdSchema,
  createProfileSchema,
} from '../../../profiles/schemas.js';
import { MemberTypeIdEnum } from '../../models/memberType.js';
import { UUIDType } from '../../types/uuid.js';

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

export type CreateProfileDto = Static<(typeof createProfileSchema)['body']>;

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

export type ChangeProfileDto = Static<(typeof changeProfileByIdSchema)['body']>;
