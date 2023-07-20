import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat, GraphQLString } from 'graphql';
import { Profile } from './profile.js'
import { Post } from './post.js'; 

export const User = new GraphQLObjectType ({
    name: 'user',
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
        resolve: async (parent, args, context) => {
          
            console.log('user.profile: ', parent, args)  
          
          return await context.prisma.profile.findFirst({
            where: {userId: parent.id}
          });
        },
      },

      posts: {
        type: new GraphQLList(Post!),
        resolve: async (parent, args, context) => {

            console.log('user.post: ', parent, args)  

            return await context.prisma.post.findMany({
            where: {authorId: parent.id}
          });
        },
      },

  
    })
});
  