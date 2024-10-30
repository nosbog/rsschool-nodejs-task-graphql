import { GraphQLString, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
  
export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLString },
        profile: { type: ProfileType },
        posts: { type: new GraphQLList(PostType) },
        userSubscribedTo: { type: new GraphQLList(UserType) },
        subscribedToUser: { type: new GraphQLList(UserType) },
    }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInputType',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
    name: 'ChangeUserInputType',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }),
});
