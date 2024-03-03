import { GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { UserType } from './user.js';

export const SubscribersOnAuthorsType = new GraphQLObjectType({
    name: 'SubscribersOnAuthors',
    fields: {
        subscriber: { type: UserType },
        subscriberId: { type: UUIDType },
        author: { type: UserType },
        authorId: { type: UUIDType },
    },
});
