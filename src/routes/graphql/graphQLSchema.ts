import { GraphQLSchema } from 'graphql';
import queries from './queries/queries.js';
import mutations from './mutationTypes/mutationTypes.js';

const graphQLSchema = new GraphQLSchema({
  query: queries,
  mutation: mutations,
});

export default graphQLSchema;
