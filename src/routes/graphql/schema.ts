import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberTypeType } from './models/memberType.js';
import { PostType } from './models/post.js';
import { ProfileType } from './models/profile.js';
import { SubscribersOnAuthorsType } from './models/subscribersOnAuthors.js';
import { UserType } from './models/user.js';
import { postMutations } from './mutations/post/postMutations.js';
import { profileMutations } from './mutations/profile/profileMutations.js';
import { userMutations } from './mutations/user/userMutations.js';
import { memberTypeResolvers } from './resolvers/memberTypeResolvers.js';
import { postResolvers } from './resolvers/postResolvers.js';
import { profileResolvers } from './resolvers/profileResolvers.js';
import { userResolvers } from './resolvers/userResolvers.js';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userResolvers,
    ...memberTypeResolvers,
    ...postResolvers,
    ...profileResolvers,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutations,
    ...postMutations,
    ...profileMutations,
  },
});

export const schema = new GraphQLSchema({
  types: [UserType, MemberTypeType, PostType, ProfileType, SubscribersOnAuthorsType],
  query: rootQuery,
  mutation: Mutation,
});
