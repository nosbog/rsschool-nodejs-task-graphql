import { MemberType } from '../schemas.js';
import { GraphQLList } from 'graphql';
import { MemberTypeId } from '../types/memberType.js';
import { getMemberType } from './helpers.js';

export const memberTypesQuery = {
  type: new GraphQLList(MemberType),
  resolve: async (parent, args, context, info) => {
    const posts = await context.prisma.memberType.findMany();
    return posts;
  },
};

export const memberTypeQuery = {
  type: MemberType,
  args: { id: { type: MemberTypeId } },
  resolve: async (parent, { id }, context, info) => {
    return getMemberType(context.prisma, { id });
  },
};
