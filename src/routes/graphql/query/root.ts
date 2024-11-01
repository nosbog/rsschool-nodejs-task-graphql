import { GraphQLObjectType } from "graphql";
import { postQueryType } from "./post.js";
import {profileQueryType} from "./profile.js";
import {userQueryType} from "./user.js";
import {memberQueryType} from "./member.js";

export const queryRootType = new GraphQLObjectType({
    name: 'Query',
    description: 'Query Root Type',
    fields: () => ({
        ...postQueryType,
        ...profileQueryType,
        ...userQueryType,
        ...memberQueryType
    })
});
