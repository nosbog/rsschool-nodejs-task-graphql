import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType, MemberTypeIdEnum } from './member.js';
import { UUIDType } from './uuid.js';


export const ProfileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    memberType: {
      type: MemberType,
      resolve: ({ memberTypeId }: { memberTypeId: string; }, args, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.memberType.findUnique({
          where: {
            id: memberTypeId,
          },
        });
      },
    },
  })
});

export const ProfileQuery = new GraphQLObjectType({
  name: "ProfileQuery",
  fields: () => ({
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (source, args, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.profile.findMany();
      }
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: { prisma: PrismaClient; }) => {
        return prisma.profile.findUnique({
          where: {
            id
          }
        });
      }
    }
  }),
})