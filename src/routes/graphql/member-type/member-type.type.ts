import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeModel } from './member-type.model.js';
import { RequestContext } from '../types/request-context.js';
import { ProfileGQLType } from '../profile/profile.type.js';

export const MemberTypeIdGQL = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'Values for MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberTypeGQL: GraphQLObjectType<MemberTypeModel, RequestContext> =
  new GraphQLObjectType({
    name: 'MemberTypes',
    description: '',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeIdGQL) },
      discount: { type: GraphQLFloat },
      postsLimitPerMonth: { type: GraphQLInt },
      profiles: {
        type: new GraphQLList(ProfileGQLType),
        resolve: async (parent, _args: unknown, context: RequestContext) => {
          const profiles = await context.prismaClient.profile.findMany({
            where: { memberTypeId: parent.id },
          });
          return profiles;
        },
      },
    }),
  });
