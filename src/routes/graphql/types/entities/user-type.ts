import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from "graphql";
import { User } from "@prisma/client";

import { UUIDType } from "../uuid.js";
import { postType } from "./post-type.js";
import { profileType } from "./profile-type.js";

export const userType: GraphQLObjectType =  new GraphQLObjectType<User>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { type: profileType },
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))) },
    userSubscribedTo: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))) },
    subscribedToUser: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))) },
  }),
});

export const subscribersOnAuthors =  new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: { type: new GraphQLNonNull(userType) },
    subscriberId: { type: GraphQLString },
    author: { type: new GraphQLNonNull(userType) },
    authorId: { type: GraphQLString },
    }),
});