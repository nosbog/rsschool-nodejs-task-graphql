import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql';

import { SubscriptionToUser, UserSubscription, UserType } from '../types/users.js';
import { Context, idFieldType } from '../types/util.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const UserQueries = {
  user: {
    type: UserType,
    args: {
      id: idFieldType.id,
    },
    resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
      return db.user.findUnique({ where: { id } });
    },
  },
  users: {
    type: new GraphQLNonNull(new GraphQLList(UserType)),
    resolve: async (
      _: unknown,
      __: unknown,
      { db, loaders }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parseResolveInfo(info) as ResolveTree,
        UserType,
      );

      const subscribedToUser = 'subscribedToUser' in fields;
      const userSubscribedTo = 'userSubscribedTo' in fields;

      const users = await db.user.findMany({
        include: {
          subscribedToUser,
          userSubscribedTo,
        },
      });

      if (subscribedToUser || userSubscribedTo) {
        const { usersSubscriptionsLoader, subscriptionsToUsersLoader } = loaders;

        const map: Record<string, UserSubscription | SubscriptionToUser> = {};
        users.forEach((user) => {
          const key = user.id;
          map[key] = user;
        });

        users.forEach((user) => {
          if (subscribedToUser) {
            subscriptionsToUsersLoader.prime(
              user.id,
              user.subscribedToUser.map((it) => {
                const key = it.subscriberId;
                return map[key] as UserSubscription;
              }),
            );
          }

          if (userSubscribedTo) {
            usersSubscriptionsLoader.prime(
              user.id,
              user.userSubscribedTo.map((subscription) => {
                const key = subscription.authorId;
                return map[key] as SubscriptionToUser;
              }),
            );
          }
        });
      }

      return users;
    },
  },
};
