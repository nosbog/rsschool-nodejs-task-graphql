import { GraphQLObjectType } from "graphql";
import { postQueryType } from "./post.js";
import {profileQueryType} from "./profile.js";
import {userQueryType} from "./user.js";
import {memberQueryType} from "./member.js";

export const rootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Query Root Type',
    fields: {
        ...memberQueryType,
        ...userQueryType,
        ...postQueryType,
        ...profileQueryType
    }
});
