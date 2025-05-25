import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ProfileModel } from './profile.model.js';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeGQL, MemberTypeIdGQL } from '../member-type/member-type.type.js';
import { UserGQLType } from '../user/user.type.js';

export const ProfileGQLType: GraphQLObjectType<ProfileModel, RequestContext> =
  new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: UUIDType },
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      userId: { type: UUIDType },
      memberTypeId: { type: MemberTypeIdGQL },

      user: {
        type: UserGQLType,
        resolve: async (
          parent: ProfileModel,
          _noArgs: unknown,
          context: RequestContext,
        ) => {
          const user = await context.dataLoaders.user.load(parent.userId);
          return user;
        },
      },

      memberType: {
        type: MemberTypeGQL,
        resolve: async (
          parent: ProfileModel,
          _noArgs: unknown,
          context: RequestContext,
        ) => {
          const memberType = await context.dataLoaders.memberType.load(
            parent.memberTypeId,
          );
          return memberType;
        },
      },
    }),
  });

export const CreateProfileInputGQLType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdGQL) },
  }),
});

export const ChangeProfileInputGQLType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdGQL },
  }),
});
