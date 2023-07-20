import { GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLBoolean, GraphQLInt } from 'graphql';

export const Profile = new GraphQLObjectType ({
    name: 'profile',
    fields: () => ({
      id: {
        type: UUIDType!
      },
      isMale: {
        type: GraphQLBoolean!
      },
      yearOfBirth: {
        type: GraphQLInt!
      }  
    })
});
  