import { GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat, GraphQLString } from 'graphql';

export const User = new GraphQLObjectType ({
    name: 'user',
    fields: () => ({
      id: {
        type: UUIDType!
      },
      name: {
        type: GraphQLString
      },
      balance: {
        type: GraphQLFloat
      }  
    })
});
  