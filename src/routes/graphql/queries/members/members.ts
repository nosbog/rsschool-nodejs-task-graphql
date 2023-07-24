import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,

} from 'graphql';
import { MemberTypeId } from '../../../member-types/schemas.js';
import profileObjectType from '../profiles/profiles.js';

import IContext from '../../types/context.js';
import { MemberType } from '@prisma/client';

const memberTypeEnumType = new GraphQLEnumType({
  name: 'MemberTypeEnum',
  description: 'A MemberTypeEnum',
  values: {
    basic: {
      value: MemberTypeId.BASIC,
      description: 'basic',
    },
    business: {
      value: MemberTypeId.BUSINESS,
      description: 'business',
    },
  },
});

const memberObjectType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'A MemberType',
  fields: () => ({
    id: {
      type: memberTypeEnumType,
      description: 'The id',
    },
    discount: {
      type: GraphQLFloat,
      description: 'The discount',
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
      description: 'The post limit per month',
    },
    profiles: {
      type: profileObjectType,
      description: 'The profiles',
      resolve: async (source: MemberType, _args, context: IContext) => {
        return await context.prisma.profile.findMany({
          where: {
            memberTypeId: source.id,
          },
        });
      },
    },
  }),
});

export default memberObjectType;
