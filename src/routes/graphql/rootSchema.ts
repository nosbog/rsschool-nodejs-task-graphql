import {GraphQLObjectType, GraphQLSchema} from "graphql";
import {memberFields} from "./fields/members.js";
import {postFields} from "./fields/posts.js";
import {userFields} from "./fields/users.js";
import {profileFields} from "./fields/profiles.js";

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        ...memberFields,
        ...postFields,
        ...userFields,
        ...profileFields,
    }
})

export const rootSchema = new GraphQLSchema({
    query: rootQuery,
})
