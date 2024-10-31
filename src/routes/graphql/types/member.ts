import { PrismaClient } from "@prisma/client";
import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    BASIC: { value: "BASIC" },
    BUSINESS: { value: "BUSINESS" },
  },
});

export const MemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});


export const MemberQuery = new GraphQLObjectType({
  name: "MemberQuery",
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (source, args, { prisma }: { prisma: PrismaClient; }) => {
        return await prisma.memberType.findMany();
      }
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) }
      },
      resolve: async (source, { id }: { id: string; }, { prisma }: { prisma: PrismaClient; }) => {
        return await prisma.memberType.findUnique({ where: { id } });
      }
    },
  })
});