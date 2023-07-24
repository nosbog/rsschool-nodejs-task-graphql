import { GraphQLObjectType } from 'graphql';
import memberObjectType from './members/members.js';
import postObjectType  from './posts/posts.js';
import profileObjectType from './profiles/profiles.js';
import { users } from './users/users.js';

const queryTypes = new GraphQLObjectType<any, any>({
  name: 'Query',
  fields: {
    ...memberObjectType,
    ...postObjectType,
    ...profileObjectType,
    ...users,
  },
});

export default queryTypes;
