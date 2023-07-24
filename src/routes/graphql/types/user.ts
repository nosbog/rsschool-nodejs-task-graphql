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
                        });

                        const rowsN = ids.map(id => rows.find(x => x.id === id));

                        if (rows.length != ids.length) {

                            let index = 0;
                            while (index < rowsN.length) {
                                const el = rowsN[index];
                                if (el) {
                                    index ++
                                } else {
                                    rowsN.splice(index, 1);
                                    ids.splice(index, 1);
                                }
                            }

                        }

                        return rows; //sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                } 

                const user = dl.load(parent.id);
                const users = [user];
                return users;
    
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
                        });
                        
                        const rowsN = ids.map(id => rows.find(x => x.id === id));

                        if (rows.length != ids.length) {

                            let index = 0;
                            while (index < rowsN.length) {
                                const el = rowsN[index];
                                if (el) {
                                    index ++
                                } else {
                                    rowsN.splice(index, 1);
                                    ids.splice(index, 1);
                                }
                            }

                        }

                        const sortedInIdsOrder = rows; //ids.map(id => rows.find(x => x.id === id));

                        return sortedInIdsOrder;
                    })
                    dataloaders.set(info.fieldNodes, dl);

                } 

                const user = dl.load(parent.id);
                const users = [user];
                return users;
                    
            }

        },
        memberType: {
            type: new GraphQLList( new GraphQLNonNull( MemberType)),
            resolve: async (parent, args, context, info) => {
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
  