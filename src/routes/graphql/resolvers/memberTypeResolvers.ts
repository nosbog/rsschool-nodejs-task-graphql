import { GraphQLList } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { MemberTypeIdEnum, MemberTypeType } from '../models/memberType.js';
import { Context } from '../types/context.js';

export const memberTypeResolvers = {
  memberTypes: {
    type: new GraphQLList(MemberTypeType),
    resolve: async (_, _args, context: Context) => {
      const memberTypes = await context.prisma.memberType.findMany();

      return memberTypes;
    },
  },
  memberType: {
    type: MemberTypeType,
    args: {
      id: { type: MemberTypeIdEnum },
    },
    resolve: async (_, args: { id: MemberTypeId }, context: Context) => {
      const memberType = await context.prisma.memberType.findUnique({
        where: { id: args.id },
      });

      return memberType;
    },
  },
};
