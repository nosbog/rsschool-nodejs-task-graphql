/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';
import { UserBody } from '../getLoader.ts';
import { Context } from './rootQuery.ts';
import { UUIDType } from './uuid.ts';
import { PostType } from './postType.ts';
import { ProfileType } from './profileType.ts';

export const UserType: GraphQLObjectType = new GraphQLObjectType<UserBody, Context>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user, _args, ctx) => {
        return await ctx.profileLoader.load(user.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, _args, ctx) => {
        return await ctx.postLoader.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, ctx) => {
        return await ctx.userSubscribedTo.load(user.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, ctx) => {
        return await ctx.subscribedToUser.load(user.id);
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});
