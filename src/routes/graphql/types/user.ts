import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, 
    GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js'
import { Post } from './post.js'; 

export const User = new GraphQLObjectType ({
    name: 'User',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(UUIDType),
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        balance: {
            type: new GraphQLNonNull(GraphQLFloat)
        },

        profile: {
            type: Profile,
            resolve: async (parent, args, context) => {
            
                console.log('user.profile: ', parent, args)  
            
            return await context.prisma.profile.findFirst({
                where: {userId: parent.id}
            });
            },
        },

        posts: {
            type: new GraphQLList(Post!),
            resolve: async (parent, args, context) => {

                console.log('user.post: ', parent, args)  

                return await context.prisma.post.findMany({
                where: {authorId: parent.id}
            });
            },
        },

        userSubscribedTo: {
            type: new GraphQLList(User!),
            resolve: async (parent, args, context) => {

                console.log('user.userSubscribedTo: ', parent, args)  
    
                return await context.prisma.user.findMany({
                    where: { subscribedToUser: { some: { subscriberId: parent.id } } } 
                })
            }
        },

        subscribedToUser: {
            type: new GraphQLList(User!),
            resolve: async (parent, args, context) => {

                console.log('user.subscribedToUser: ', parent, args)  
                    
                return await context.prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                authorId: parent.id,
                            }
                        }
                    }
                })
            }

        },

    })
});

export const CreateUserInput = new GraphQLInputObjectType ({
    name: 'CreateUserInput',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        balance: {
            type: new GraphQLNonNull(GraphQLFloat)
        },

    })
});

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { 
            type: GraphQLString 
        },
        balance: { 
            type: GraphQLFloat 
        },
    },
  });
  