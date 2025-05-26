import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { PostType } from "./posts.js";
import { ProfileType } from "./profile.js";
import { Context, IDArgs } from "./interfaces.js";

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        profile: {
            type: ProfileType,
            resolve: async (parent: IDArgs, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.profile || null;
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (parent: IDArgs, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.posts || null;
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async (parent: IDArgs, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.userSubscribedTo?.map(sub => sub.author) || [];
            },
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async (parent: IDArgs, _, context: Context) => {
                const user = await context.loaders.userLoader.load(parent.id);
                return user?.subscribedToUser?.map(sub => sub.subscriber) || [];
            },
        },
    }),
});

export const CreateUser = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
});

export const UpdateUser = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    },
}); 