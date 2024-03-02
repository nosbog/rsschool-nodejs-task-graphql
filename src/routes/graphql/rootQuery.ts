import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context, MemberType, MemberTypeIdType, PostType, ProfileType, UserType } from './types/types.js';
import { UUIDType } from './types/uuid.js';

export const RootQuery = new GraphQLObjectType<unknown, Context>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_obj, _args, ctx: Context) => {
        return ctx.prisma.memberType.findMany();
      },
    },
    posts: {
        type: new GraphQLList(PostType),
        resolve: async (_obj, _args, ctx: Context) => {
          return ctx.prisma.post.findMany();
        },
      },
    users: {
        type: new GraphQLList(UserType),
        resolve: async (_obj, _args, ctx: Context) => {
          return ctx.prisma.user.findMany();
        },
      },  
    profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_obj, _args, ctx: Context) => {
          return ctx.prisma.profile.findMany();
        },
      }, 
    memberType: {
        type: new GraphQLNonNull(MemberType),
        args: {
            id: { type: new GraphQLNonNull(MemberTypeIdType) },
        },
        resolve: async (_obj, args: { id: string }, ctx: Context) => {
          return ctx.prisma.memberType.findUnique({
            where: {
              id: args.id,
            }});
        },
      },  
      post: {
        type: PostType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, args: { id: string }, ctx: Context) => {
          const post = await ctx.prisma.post.findUnique({
            where: { id: args.id, }
          });
          if (!post) {
            return null; 
          }
          return post;            
        },
      },    
      user: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: { id: string }, ctx: Context) => {
          const user = await ctx.prisma.user.findUnique({
            where: { id: args.id, }
          });
          if (!user) {
            return null; 
          }
          return user; 
        },
      },  
      profile: {
        type: ProfileType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: { id: string }, ctx: Context) => {
          const profile = await ctx.prisma.profile.findUnique({
            where: { id: args.id, }
          });
          if (!profile) {
            return null; 
          }
          return profile; 
        },
      },  
  },
});