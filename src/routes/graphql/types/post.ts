import { GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { User } from './user.js';

export const Post: GraphQLObjectType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { 
            type: UUIDType
        },
        title: { 
            type: GraphQLString
        },
        content: { 
            type: GraphQLString
        },
        authorId: { 
            type: UUIDType
        },
        author: { 
            type: User
        },
    }),
});