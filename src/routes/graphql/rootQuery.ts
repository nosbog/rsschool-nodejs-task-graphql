import { GraphQLObjectType } from 'graphql';

import { userQueries } from './queries/userQueries.js';

export const queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    ...userQueries,
  }),
});
