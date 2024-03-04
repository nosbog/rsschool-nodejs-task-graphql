import { GraphQLBoolean, GraphQLObjectType } from 'graphql';

export const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    users: {
      type: GraphQLBoolean,
      resolve: () => {
        return true
      }
    }
  }
})
