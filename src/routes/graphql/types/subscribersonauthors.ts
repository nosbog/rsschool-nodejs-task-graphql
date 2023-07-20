import { GraphQLNonNull, 
    GraphQLObjectType, GraphQLString } from 'graphql';

export const SubscribersOnAuthors = new GraphQLObjectType ({
    name: 'SubscribersOnAuthors',
    fields: () => ({
        subscriberId: {
        type: new GraphQLNonNull(GraphQLString),
        },
        authorId: {
        type: new GraphQLNonNull(GraphQLString),
        },
    })

});
    