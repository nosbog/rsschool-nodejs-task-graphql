import {
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import { Context, idFieldType } from './util.js';
import { userSchema } from '../../users/schemas.js';
import { Static } from '@sinclair/typebox';
import { PostType } from './posts.js';
import { ProfileType } from './profiles.js';

export type User = Static<typeof userSchema>;

type Subscription = {
    subscriberId: string;
    authorId: string;
};

export type UserSubscription = User & {
    userSubscribedTo: Subscription[];
};

export type SubscriptionToUser = User & {
    subscribedToUser: Subscription[];
};

const userFields = {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
};

const userFieldsPartial = {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
};

export const UserType: GraphQLObjectType = new GraphQLObjectType<User, Context>({
    name: 'UserType',
    fields: () => ({
        ...idFieldType,
        ...userFields,
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }: User, _: unknown, { loaders }: Context) => {
                return loaders.subscriptionsToUsersLoader.load(id);
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }: User, _: unknown, { loaders }: Context) => {
                return loaders.usersSubscriptionsLoader.load(id);
            },
        },
        posts: {
            type: new GraphQLNonNull(new GraphQLList(PostType)),
            resolve: async ({ id }: User, _: unknown, { loaders }: Context) => {
                return loaders.postsLoader.load(id);
            },
        },
        profile: {
            type: ProfileType,
            resolve: async ({ id }: User, _: unknown, { loaders }: Context) => {
                return loaders.profilesLoader.load(id);
            },
        },
    }),
});

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        ...userFields,
    },
});

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        ...userFieldsPartial,
    },
});