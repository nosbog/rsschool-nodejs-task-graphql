import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, 
    GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js'
import { Post } from './post.js'; 
import DataLoader from 'dataloader';
import { MemberType } from './member-type.js';

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
//            type: new GraphQLList(Profile),
            resolve: async (parent, args, context, info) => {
            
                const {dataloaders} = context;

                console.log('user.profile: ', parent, dataloaders)

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {
                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.profile.findMany({
                            where: {userId: {in: ids}}
                        });

                        console.log('DB user profiles ids rows:', ids, rows);
                        
                        const sortedInIdsOrder = ids.map(id => rows.find(x => x.userId === id));

                        console.log('sortedInIdsOrder: ', sortedInIdsOrder) 

                        return sortedInIdsOrder;    
                    })
                    dataloaders.set(info.fieldNodes, dl);

                }    

                const user = dl.load(parent.id);
                console.log('User from dl.load:', user);
                return user;

            },
        },

        posts: {
            type: Post,
//            type: new GraphQLList(Post),
            resolve: async (parent, args, context, info) => {

                const {dataloaders} = context;

                console.log('user.post: ', parent, dataloaders)

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {

                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.post.findMany({
                            where: {authorId: {in: ids}}
                        });

                        console.log('DB user posts:', rows);
                        
                        const sortedInIdsOrder = ids.map(id => rows.find(x => x.authorId === id));
                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                } 

                return dl.load(parent.id);

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
        memberType: {
            type: new GraphQLList( new GraphQLNonNull( MemberType)),
            resolve: async (parent, args, context, info) => {
            console.log ('MemberType: ', parent);
            }
        }

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
  