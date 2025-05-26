import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserQuery } from './user/user.query.js';
import { MemberTypeQuery } from './member-type/member-type.query.js';
import { ProfileQuery } from './profile/profile.query.js';
import { PostQuery } from './post/post.query.js';
import { PostMutation } from './post/post.mutation.js';
import { ProfileMutation } from './profile/profile.mutation.js';
import { UserMutation } from './user/user.mutation.js';

export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({ ...UserQuery, ...MemberTypeQuery, ...ProfileQuery, ...PostQuery }),
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({ ...PostMutation, ...ProfileMutation, ...UserMutation }),
  }),
});
