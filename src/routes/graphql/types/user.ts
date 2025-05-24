import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { Context, User } from '../ts-types.js';
import { getProfileByUser } from '../resolvers/Profile.resolver.js';
import { getPostByUser } from '../resolvers/Post.resolver.js';
import { getUser } from '../resolvers/User.resolver.js';

export const UserType: GraphQLObjectType<User, Context> = new GraphQLObjectType<
  User,
  Context
>({
  name: 'User',
  description: 'Represents a user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType, resolve: getProfileByUser },
    posts: { type: new GraphQLList(PostType), resolve: getPostByUser },
    userSubscribedTo: { type: new GraphQLList(UserType), resolve: getUser },
    subscribedToUser: { type: new GraphQLList(UserType), resolve: getUser },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  description: 'Input type for modifying a user',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  description: 'Input type for adding a user',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
