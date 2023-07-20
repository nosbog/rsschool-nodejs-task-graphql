import { GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat, GraphQLString } from 'graphql';
import { Profile } from './profile.js'

export const User = new GraphQLObjectType ({
    name: 'user',
    fields: () => ({
      id: {
        type: UUIDType!
      },
      name: {
        type: GraphQLString
      },
      balance: {
        type: GraphQLFloat
      },
      profile: {
        type: Profile,
        resolve: async (source, args, context) => {
          return await context.prisma.profile.findUnique({
            where: {id: source.id}
          });
        },
      },
  
    })
});
  