import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { GqlContext, Member, UUID } from '../types.js';
import { MemberTypeId } from './MemberTypeId.js';

export const MemberType: GraphQLObjectType<Member, GqlContext> = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: MemberTypeId,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
  }),
});

export const MemberTypeQueries = {
  memberType: {
    type: MemberType,
    args: {
      id: {
        type: MemberTypeId,
      },
    },
    async resolve(_, args, ctx) {
      return ctx.prisma.memberType.findUnique({ where: { id: args.id } });
    },
  },
  memberTypes: {
    type: new GraphQLList(MemberType),
    async resolve(_, __, ctx) {
      return ctx.prisma.memberType.findMany();
    },
  },
} satisfies {
  memberType: GraphQLFieldConfig<void, GqlContext, { id: UUID }>;
  memberTypes: GraphQLFieldConfig<void, GqlContext>;
};
