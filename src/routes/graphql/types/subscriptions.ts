import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { User } from './user.js';

export const Subscriptions = new GraphQLObjectType ({
    name: 'Subscriptions',
    fields: () => ({
        subscriberId: {
            type: User,
            resolve: async (parent, args, context) => {

                console.log('Subscribers.subscriberId: ', parent, args)  
    
                return await context.prisma.user.findFirst({
                    where: {id: parent.authorId}
                })
            }

        },
        authorId: {
            type: User,
            resolve: async (parent, args, context) => {

                console.log('Subscribers.authorId: ', parent, args)  
    
                return await context.prisma.user.findFirst({
                    where: {id: parent.subscriberId}
                })
            }
        
        },

    })
});

