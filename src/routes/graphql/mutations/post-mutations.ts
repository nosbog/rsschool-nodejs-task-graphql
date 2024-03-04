import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';


export const createPostInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        title: {
            type: GraphQLString
        },
        content: {
            type: GraphQLString
        },
        authorId: {
            type: UUIDType
        },
    }),
})


export const changePostInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: () => ({
        title: {
            type: GraphQLString
        },
    }),
});