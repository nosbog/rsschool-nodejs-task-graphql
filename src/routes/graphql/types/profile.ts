import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
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
});

type ProfileDto = {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
};

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
    userId: { type: UUIDType },
  }
});

export const ProfileMutation = new GraphQLObjectType({
  name: "ProfileMutation",
  fields: {
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (source, { dto }: { dto: ProfileDto; }, { prisma }: { prisma: PrismaClient; }) => {
        return await prisma.profile.create({
          data: dto,
        });
      }
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (source, { id, dto }: { id: string; dto: Partial<ProfileDto>; }, { prisma }: { prisma: PrismaClient; }) => {
        return await prisma.profile.update({
          where: { id },
          data: dto,
        });
      }
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: { prisma: PrismaClient; }) => {
        await prisma.profile.delete({ where: { id } });
        return true;
      }
    }
  }
});