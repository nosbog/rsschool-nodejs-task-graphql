import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from 'graphql'


export const createUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        balance: {
            type: GraphQLFloat
        },
    }),
});

export const changeUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: () => ({
        name: {
            type: GraphQLString
        },
    }),
});