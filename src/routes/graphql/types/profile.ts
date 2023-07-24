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
              const rowsB = await context.prisma.memberType.findMany({
                select: {
                  id: true,
                  discount: true,
                  postsLimitPerMonth: true,
                  profiles: {
                    select: {
                      id: true,
                    },
                    where: {
                      id: {in: ids}
                    },
                  },
                },
              });

              const rowsC: any[] = [];
              for (let k = 0; k < rowsB.length; k++) {
                const elk = rowsB[k];
                for (let l = 0; l < elk.profiles.length; l++) {
                  const  ell: any = {};
                  ell.id = elk.id;
                  ell.discount = elk.discount;
                  ell.postsLimitPerMonth = ell.postsLimitPerMonth;
                  ell.pid = elk.profiles[l].id;
                  
                  rowsC.push(ell);
                }
              } 
              
              const sortedInIdsOrder = ids.map(id => rowsC.find(x => x.pid === id));
              return sortedInIdsOrder;
            })
            dataloaders.set(info.fieldNodes, dl);

          }

          const profile = dl.load(source.id);
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
