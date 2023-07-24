import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import memberObjectType from '../members/members.js';




import IUserContext from '../../types/context.js';
import { Profile } from '@prisma/client';
import { userObjectType } from '../users/users.js';

const profileObjectType = new GraphQLObjectType({
  name: 'ProfileType',
  description: 'A Profile',
  fields: () => ({
    id: {
      type: UUIDType,
      description: 'The id',
    },
    isMale: {
      type: GraphQLBoolean,
      description: 'Is user a male',
    },
    yearOfBirth: {
      type: GraphQLInt,
      description: 'The year of birth',
    },
    user: {
      type: userObjectType,
      description: 'The user',
      resolve: async (source: Profile, _args, context: IUserContext) => {
        return await context.prisma.user.findUnique({
          where: {
            id: source.userId,
          },
        });
      },
    },
    userId: {
      type: UUIDType,
      description: 'The userId',
    },
    memberType: {
      type: memberObjectType,
      description: 'The memberType',
      resolve: async (source: Profile, _args, context: IUserContext) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: source.memberTypeId,
          },
        });
      },
    },
    memberTypeId: {
      type: memberObjectType,
      description: 'The memberTypeId',
    },
  }),
});

export default profileObjectType;
