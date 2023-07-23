import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, 
    GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js'
import { Post } from './post.js'; 
import DataLoader from 'dataloader';

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
            resolve: async (parent, args, context, info) => {
            
                const {dataloaders} = context;

                console.log('user.profile: ', parent, dataloaders)

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {
                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.profile.findMany({
                            where: {userId: parent.id}
                        });

                        console.log('DB user profiles:', rows);
                        
                        const sortedInIdsOrder = ids.map(id => rows.find(x => x.id === id));
                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                    console.log('DB users profiles dl.load:', dl.load(parent.id));
                    return dl.load(parent.id);

                } else {

                    console.log('Map users profiles dl.load:', dl.load(parent.id));
                    return dl.load(parent.id);

                }

//                return await context.prisma.profile.findFirst({
//                    where: {userId: parent.id}
//                });
            },
        },

        posts: {
            type: new GraphQLList(Post!),
            resolve: async (parent, args, context, info) => {

                const {dataloaders} = context;

                console.log('user.post: ', parent, dataloaders)

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {
                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.post.findMany({
                            where: {authorId: parent.id}
                        });

                        console.log('DB user posts:', rows);
                        
                        const sortedInIdsOrder = ids.map(id => rows.find(x => x.id === id));
                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                    console.log('DB users posts dl.load:', dl.load(parent.id));
                    return dl.load(parent.id);

                } else {

                    console.log('Map users posts dl.load:', dl.load(parent.id));
                    return dl.load(parent.id);

                }


//                return await context.prisma.post.findMany({
//                where: {authorId: parent.id}
//            });
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
  