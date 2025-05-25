import { GraphQLList } from 'graphql';
import { MemberTypeGQL, MemberTypeIdGQL } from './member-type.type.js';
import { RequestContext } from '../types/request-context.js';

export const MemberTypeQuery = {
  memberTypes: {
    type: new GraphQLList(MemberTypeGQL),
    description: 'List of all Member Types',
    resolve: async (_noParent: unknown, _noArgs: unknown, context: RequestContext) => {
      const memberTypes = await context.prismaClient.memberType.findMany();
      return memberTypes;
    },
  },
  memberType: {
    type: MemberTypeGQL,
    description: 'Get Member Type by Id',
    args: { id: { type: MemberTypeIdGQL } },
    resolve: async (
      _noParent: unknown,
      args: { id: string },
      context: RequestContext,
    ) => {
      const memberType = await context.dataLoaders.memberType.load(args.id);
      return memberType;
    },
  },
};
