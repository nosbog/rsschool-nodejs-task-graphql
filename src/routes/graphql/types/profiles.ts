import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberIdType, MemberType } from './memberTypes.js';

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: (obj, _args, { prisma }) => {
        return prisma.memberType.findUnique({
          where: {
            id: obj.memberTypeId,
          },
        });
      },
    },
    memberTypeId: { type: MemberIdType },
  },
});

export { Profile };
