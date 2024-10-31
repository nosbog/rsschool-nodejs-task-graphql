import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { MemberQuery } from './types/member.js';
import { PostQuery } from './types/post.js';
import { ProfileQuery } from './types/profile.js';
import { UserQuery } from './types/user.js';



const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    ...MemberQuery.toConfig().fields,
    ...PostQuery.toConfig().fields,
    ...ProfileQuery.toConfig().fields,
    ...UserQuery.toConfig().fields
  }
});

export const schema: GraphQLSchema = new GraphQLSchema({
  query: RootQuery,
});
