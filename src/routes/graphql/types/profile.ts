import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType } from './member.js';
import { UUIDType } from './uuid.js';
import { Context } from './common.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (sourse: { memberTypeId: string }, args, { prisma }: Context) =>
        await prisma.memberType.findUnique({ where: { id: sourse.memberTypeId } }),
    },
  }),
});