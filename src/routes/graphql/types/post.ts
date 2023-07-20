import { GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLInt, GraphQLString } from 'graphql';

export const Post = new GraphQLObjectType ({
    name: 'post',
    fields: () => ({
      id: {
        type: UUIDType!
      },
      title: {
        type: GraphQLInt
      },
      content: {
        type: GraphQLString
      }  
    })
});
  