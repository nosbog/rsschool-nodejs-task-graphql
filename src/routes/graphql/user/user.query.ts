import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { UserGQLType } from './user.type.js';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { UserModel } from './user.model.js';

export const UserQuery = {
  user: {
    type: UserGQLType,
    description: 'A single user',
    args: { id: { type: UUIDType } },
    resolve: async (_parent: unknown, args: { id: string }, context: RequestContext) => {
      const user = await context.dataLoaders.user.load(args.id);
      return user;
    },
  },
  users: {
    type: new GraphQLList(UserGQLType),
    description: 'List of all users',
    resolve: async (
      _noParent: unknown,
      _noArgs: unknown,
      context: RequestContext,
      resolveInfo: GraphQLResolveInfo,
    ) => {
      const fragment = parseResolveInfo(resolveInfo);
      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        fragment as ResolveTree,
        resolveInfo.returnType,
      );

      const users: UserModel[] = await context.prismaClient.user.findMany({
        include: {
          subscribedToUser: 'subscribedToUser' in fields,
          userSubscribedTo: 'userSubscribedTo' in fields,
        },
      });

      users.forEach((user) => {
        context.dataLoaders.user.prime(user.id, user);
      });

      return users;
    },
  },
};
