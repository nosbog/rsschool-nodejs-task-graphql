import { GraphQLFieldConfig } from "graphql";
import { MemberTypeType } from "./type.js";
import { Context } from "../types/context.js";

type Args = {
  id: string
};

const memberTypes: GraphQLFieldConfig<void, Context, void> = {
  type: MemberTypeType,
  resolve: async (_source, _args, { prisma }) => {
    return await prisma.memberType.findMany();
  },
};

const memberType: GraphQLFieldConfig<void, Context, Args> = {
  type: MemberTypeType,
  resolve: async (_source, { id }, { prisma }) => {
    return await prisma.memberType.findUnique({ where: { id: id } });
  },
};

export const MemberTypeQueries = {
  memberTypes,
  memberType
};