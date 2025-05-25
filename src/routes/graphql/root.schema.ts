import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserQuery } from './user/user.query.js';
import { MemberTypeQuery } from './member-type/member-type.query.js';
import { ProfileQuery } from './profile/profile.query.js';
import { PostQuery } from './post/post.query.js';

export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({ ...UserQuery, ...MemberTypeQuery, ...ProfileQuery, ...PostQuery }),
  }),
});
