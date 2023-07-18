import {GraphQLObjectType, GraphQLSchema} from "graphql";
import {memberQueryFields} from "./fields/members.js";
import {postQueryFields} from "./fields/posts.js";
import {userQueryFields} from "./fields/users.js";
import {profileQueryFields} from "./fields/profiles.js";

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        ...memberQueryFields,
        ...postQueryFields,
        ...userQueryFields,
        ...profileQueryFields,
    }
})

export const rootSchema = new GraphQLSchema({
    query: rootQuery,
})
