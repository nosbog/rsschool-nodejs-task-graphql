import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Post } from './posts.js';
import { Profile } from './profiles.js';

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (obj, _args, context) => {
        return await context.profileLoader.load(obj.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (obj, _args, context) => {
        return await context.postLoader.load(obj.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (obj, _args, context) => {
        const authorIds = obj.userSubscribedTo.map((user) => user.authorId);
        return await context.userLoader.loadMany(authorIds);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (obj, _args, context) => {
        const subsIds = obj.subscribedToUser.map((user) => user.subscriberId);
        return await context.userLoader.loadMany(subsIds);
      },
    },
  }),
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export { User, CreateUserInput, ChangeUserInput };
