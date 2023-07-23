import graphql, { GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './post.js';
import { IContext, IParent } from './common.js';
import { ProfileType } from './profile.js';
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat } = graphql;

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (source: IParent, args, context: IContext) => {
        return await context.prisma.profile.findUnique({ where: { userId: source.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source: IParent, args, context: IContext) => {
        return await context.prisma.post.findMany({
          where: { authorId: source.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(PostType),
      resolve: async (source: IParent, args, context: IContext) => {
        return await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: source.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(PostType),
      resolve: async (source: IParent, args, context: IContext) => {
        return await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: source.id,
              },
            },
          },
        });
      },
    },
  }),
});
