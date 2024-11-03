import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './memberType.js';
import { PrismaClient, Profile } from '@prisma/client';

const prisma = new PrismaClient();

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: MemberType,
      resolve: async (profile: Profile) => {
        return await prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

// type Profile {
//   id: UUID!
//   isMale: Boolean!
//   yearOfBirth: Int!
//   memberType: MemberType!
// }
