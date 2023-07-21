import { UUIDType } from './uuid.js';
import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, 
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
  