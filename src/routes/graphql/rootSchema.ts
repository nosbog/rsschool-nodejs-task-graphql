import {GraphQLObjectType, GraphQLSchema} from "graphql";
import {memberQueryFields} from "./fields/members.js";
import {postMutationFields, postQueryFields} from "./fields/posts.js";
import {userMutationFields, userQueryFields} from "./fields/users.js";
import {profileMutationFields, profileQueryFields} from "./fields/profiles.js";

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        ...memberQueryFields,
        ...postQueryFields,
        ...userQueryFields,
        ...profileQueryFields,
    }
})

const rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        ...postMutationFields,
        ...userMutationFields,
        ...profileMutationFields,
    }
})

export const rootSchema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
})
