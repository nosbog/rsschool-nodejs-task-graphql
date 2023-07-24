import { GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import Context from '../../types/context.js';
import { Post } from '@prisma/client';
import { userObjectType } from '../users/users.js';

const postObjectType = new GraphQLObjectType({
  name: 'Post',
  description: 'A Post',
  fields: () => ({
    id: {
      type: UUIDType,
      description: 'The id',
    },
    title: {
      type: GraphQLString,
      description: 'The title',
    },
    content: {
      type: GraphQLString,
      description: 'The content',
    },
    author: {
      type: userObjectType,
      description: 'The author',
      resolve: async (source: Post, _args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: source.authorId,
          },
        });
      },
    },
    authorId: {
      type: UUIDType,
      description: 'The authorId',
    },
  }),
});

export default postObjectType;
