import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UserModel } from './user.model.js';
import { RequestContext } from '../types/request-context.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileGQLType } from '../profile/profile.type.js';
import { PostGQLType } from '../post/post.type.js';

export const UserGQLType: GraphQLObjectType = new GraphQLObjectType<
  UserModel,
  RequestContext
>({
  name: 'User',
  description: 'Represents a user',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileGQLType,
      resolve: async (parent: UserModel, _noArgs: unknown, context: RequestContext) => {
        const profile = await context.dataLoaders.profileByUser.load(parent.id);
        return profile;
      },
    },

    posts: {
      type: new GraphQLList(PostGQLType),
      resolve: async (parent: UserModel, _noArgs: unknown, context: RequestContext) => {
        const posts = await context.dataLoaders.postsByUser.load(parent.id);
        return posts;
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserGQLType),
      resolve: async (parent: UserModel, _noArgs: unknown, context: RequestContext) => {
        if (parent.subscribedToUser && parent.subscribedToUser.length) {
          const usersIds = parent.subscribedToUser.map((user) => user.subscriberId);
          const subscribers = context.dataLoaders.user.loadMany(usersIds);
          return subscribers;
        }
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserGQLType),
      resolve: async (parent: UserModel, _noArgs: unknown, context: RequestContext) => {
        if (parent.userSubscribedTo && parent.userSubscribedTo.length) {
          const usersIds = parent.userSubscribedTo.map((user) => user.authorId);
          const authors = context.dataLoaders.user.loadMany(usersIds);
          return authors;
        } else {
          return [];
        }
      },
    },
  }),
});
