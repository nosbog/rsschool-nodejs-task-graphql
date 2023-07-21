import { UUIDType } from './uuid.js';
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, 
  GraphQLObjectType, GraphQLString } from 'graphql';
import { MemberType, MemberTypeId } from './member-type.js';

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
      resolve: async (parent, args, context) => {
        
        console.log('Profile.MemberType: ', parent, args);
        
        return context.prisma.memberType.findFirst({
          where: {
            id: parent.memberType,
          },
        });
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
