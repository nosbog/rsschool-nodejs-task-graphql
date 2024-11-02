import {GraphQLObjectType} from "graphql";
import {userMutationType} from "./user.js";
import {postMutationType} from "./post.js";
import {profileMutationType} from "./profile.js";
import {subscribeMutationType} from "./subscribe.js";


export const rootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutation Root Type',
    fields:() => ({
        ...userMutationType,
        ...profileMutationType,
        ...postMutationType,
        ...subscribeMutationType
    })
});
