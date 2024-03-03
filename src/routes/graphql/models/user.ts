import { Static, Type } from '@fastify/type-provider-typebox';
import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { userFields } from '../../users/schemas.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';

const user = Type.Object(userFields);

interface Subscriber {
  subscriberId: string;
  authorId: string;
}

export interface User extends Static<typeof user> {
  userSubscribedTo: Subscriber[];
  subscribedToUser: Subscriber[];
}

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: (parent: User, _args, { dataLoaders }: Context) => {
        return dataLoaders.profilesLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (parent: User, _args, { dataLoaders }: Context) => {
        return dataLoaders.postsLoader.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _args, { dataLoaders }: Context) => {
        return dataLoaders.userSubscribedToLoader.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _args, { dataLoaders }: Context) => {
        return dataLoaders.subscribedToUserLoader.load(parent.id);
      },
    },
  }),
}) as GraphQLObjectType;
