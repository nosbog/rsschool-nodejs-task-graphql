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
            resolve: async (parent, args, context, info) => {
            
                const {dataloaders} = context;

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {
                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.profile.findMany({
                            where: {userId: {in: ids}},
                        });

                        const sortedInIdsOrder = ids.map(id => rows.find(x => x.userId === id));
                        //console.log('Users buff: ', ids, rows, sortedInIdsOrder)

                        console.log('user.profile ids info.fieldNodes: ',  ids, info.fieldNodes);

                        return sortedInIdsOrder;    
                    })
                    dataloaders.set(info.fieldNodes, dl);


                }    

                const profile = dl.load(parent.id);
                return profile;
            },
        },

        posts: {
            type: new GraphQLList(Post),
            resolve: async (parent, args, context, info) => {

                const {dataloaders} = context;

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {

                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.post.findMany({
                            where: {authorId: {in: ids}}
                        });

                        const sortedInIdsOrder = ids.map(id => rows.find(x => x.authorId === id));

                        console.log('user.posts ids info.fieldNodes: ',  ids, info.fieldNodes);

                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                } 

                const user = dl.load(parent.id);
                const users = [user];
                return users;

            },
        },

        userSubscribedTo: {
            type: new GraphQLList(User),
            resolve: async (parent, args, context, info) => {

                const {dataloaders} = context;

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {

                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.user.findMany({
                            where: { subscribedToUser: { some: { subscriberId: {in: ids} } } } 
//                            where: {authorId: {in: ids}}
//                            where: { subscribedToUser: { some: { subscriberId: parent.id } } } 
                        });

                        console.log('rows: ', rows);

                        const sortedInIdsOrder = rows; //ids.map(id => rows.find(x => x.id === id));

                        console.log('userSubscribedTo ids parent.id rows: ',  ids, parent.id, sortedInIdsOrder)

                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                } 

                const user = dl.load(parent.id);
                const users = [user];
                return users;
    
//                return await context.prisma.user.findMany({
//                    where: { subscribedToUser: { some: { subscriberId: parent.id } } } 
//                })
            }
        },

        subscribedToUser: {
            type: new GraphQLList(User),
            resolve: async (parent, args, context, info) => {

                const {dataloaders} = context;

                let dl = dataloaders.get(info.fieldNodes);
                if (!dl) {

                    dl = new DataLoader(async (ids: any) => {
                    
                        const rows = await context.prisma.user.findMany({
                            where: { userSubscribedTo: { some: { authorId: {in  : ids} } } } 
//                            where: {authorId: {in: ids}}
//                            where: { subscribedToUser: { some: { subscriberId: parent.id } } } 
                        });

                        console.log('rows: ', rows);

                        const sortedInIdsOrder = rows; //ids.map(id => rows.find(x => x.id === id));

                        console.log('subscribedToUser ids parent.id rows: ',  ids, parent.id, sortedInIdsOrder)

                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                } 

//                console.log()
                const user = dl.load(parent.id);
                const users = [user];
                return users;
                    
//                return await context.prisma.user.findMany({
//                    where: {
//                        userSubscribedTo: {
//                            some: {
//                                authorId: parent.id,
//                            }
//                        }
//                    }
//                })
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
  