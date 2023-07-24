import { UUIDType } from './uuid.js';
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, 
  GraphQLObjectType, GraphQLScalarType, GraphQLString } from 'graphql';
import { MemberType, MemberTypeId } from './member-type.js';
import DataLoader from 'dataloader';

export const Profile = new GraphQLObjectType ({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },

    memberType: {
      type: MemberType,
      resolve: async (source, args, context, info) => {

        const {dataloaders} = context;

        let dl = dataloaders.get(info.fieldNodes);
        if (!dl) {
            dl = new DataLoader(async (ids: any) => {
            
              console.log('profile ids: ', ids)

              const rowsM = await context.prisma.memberType.findMany({
//                  where: {
//                    profiles: {
//                        some: {
//                          id: {in: ids}
//                       }
//                      } 
//                  },
                });

                const rowsP = await context.prisma.profile.findMany({
                  where: {
                    id: {in: ids}
                  },
                });
                const rowsS = ids.map(id => rowsP.find(x => x.id === id));

                const rows: (typeof MemberType)[] = [];

                for (let index = 0; index < rowsS.length; index++) {
                  if (rowsS[index].memberTypeId === 'basic') {
                    const basicItem = rowsM.find(e => e.id === 'basic');
                    rows.push(basicItem)
                  } else {
                    const basinessItem = rowsM.find(e => e.id === 'business');
                    rows.push(basinessItem);
                  }
                }

/*
                const rows = await context.prisma.profile.findMany({
                  where: {
                    AND: [
                      {
                        id: { in: ids}
                      },
                      {
                        OR: [
                          {
                            memberType: {
                                id: {in: ['basic', 'business']}
                            } 
                          },
                          {
                            memberTypeId: null
                          }
                        ]
                      }
                    ]
                  },
                });
*/

                const sortedInIdsOrder = rows; //ids.map(id => rows.find(x => x.id === id));

                console.log('profile.memberType ids info.fieldNodes: ',  ids, info.fieldNodes);

                console.log('sortedInIdsOrder ids rows: ', ids, sortedInIdsOrder);
                return sortedInIdsOrder;
            })
            dataloaders.set(info.fieldNodes, dl);

        }

        const profile = dl.load(source.id);
        console.log('memberType loaded: ', profile, source.id);
        return profile;
      },

    },

  })
});

export const CreateProfileInput = new GraphQLInputObjectType ({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: { 
      type: new GraphQLNonNull(MemberTypeId) 
    },

  })
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { 
      type: GraphQLBoolean 
    },
    yearOfBirth: { 
      type: GraphQLInt 
    },
    memberTypeId: { 
      type: MemberTypeId 
    },
  },
});
