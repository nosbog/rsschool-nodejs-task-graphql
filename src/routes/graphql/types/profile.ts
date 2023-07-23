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
      resolve: async (parent, args, context, info) => {
        
        const {dataloaders} = context;

        let dl = dataloaders.get(info.fieldNodes);
        if (!dl) {
            dl = new DataLoader(async (ids: any) => {
            
                const rows = await context.prisma.memberType.findMany({
                    where: {id: {in: ids}}
                });
                
                const sortedInIdsOrder = ids.map(id => rows.find(x => x.memberTypeId === id));
                return sortedInIdsOrder;
            })
            dataloaders.set(info.fieldNodes, dl);

        }

        const profile = dl.load(parent.id);
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
