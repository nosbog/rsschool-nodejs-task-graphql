import { GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLNonNull, GraphQLString } from 'graphql';

export const Post = new GraphQLObjectType ({
    name: 'post',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
      },  
      authorId: {
        type: new GraphQLNonNull(GraphQLString),
      }  
    })
});
  