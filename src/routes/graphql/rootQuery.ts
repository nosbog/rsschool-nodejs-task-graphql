import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType } from 'graphql';
import { Context, MTIdType, MemberType, PostType, ProfileType, UserType } from './types/types.js';
import { UUIDType } from './types/uuid.js';
import { httpErrors } from '@fastify/sensible';

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
            id: { type: new GraphQLNonNull(MTIdType) },
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
        resolve: async (_obj, args: { id: string }, ctx: Context) => {
            console.log('running post API' );
            let post: unknown;
            try {
                post = await ctx.prisma.post.findUnique({
                    where: {
                        id: args.id,
                    }
                }); 
             console.log(' FOUND' );
            } 
            catch (err)  {
                console.log('NOT FOUND' );
                throw httpErrors.notFound();
            }
            return post || {post: null};
        },
      },    
      user: {
        type: new GraphQLNonNull(UserType),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: { id: string }, ctx: Context) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                  id: args.id,
                }
              });
              return user || null; 
        },
      },  
      profile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_obj, args: { id: string }, ctx: Context) => {
            const profile = await ctx.prisma.profile.findUnique({
                where: {
                  id: args.id,
                }
              });
              return profile || null; 
        },
      },  
  },
});