import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context, PostType, ProfileType, Profile_Type } from './types/types.js';

import { ChangePostInputType, ChangeProfileInput, CreateProfileInput, PostCreateInput, Post_Type } from './types/mutationsTypes.js';
import { UUIDType } from './types/uuid.js';

interface PostArgs {
  id: string;
  dto: Omit<Post_Type, 'id'>;
}

interface ProfileArgs {
  id: string;
  dto: Omit<Profile_Type, 'id'> & Partial<Omit<Profile_Type, 'id' | 'userId'>>;
}

export const rootMutation = new GraphQLObjectType({
  name: 'rootMutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(PostCreateInput) } },
      resolve: async (_obj, args: PostArgs, ctx: Context) =>
      {
        console.log('CREATE POST', args.dto);
        const post = await ctx.prisma.post.create({ data: args.dto });
        console.log('PoST', post);
        return post;
      }
     
    },
  
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (_obj, args: PostArgs, ctx: Context) =>
      {
        console.log('CREATE POST');
       await ctx.prisma.post.update({ where: { id: args.id }, data: args.dto })
      },
    },
  
    deletePost: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_obj, args: PostArgs, ctx: Context) => {
        await ctx.prisma.post.delete({ where: { id: args.id } });
        return args.id;
      },
    },

    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_obj, args: ProfileArgs, ctx: Context) => {
        return await ctx.prisma.profile.create(
          {
             data: args.dto 
          });
      }
    },
  
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_obj, args: ProfileArgs, ctx: Context) => {
        return await ctx.prisma.profile.update(
          { 
            where: 
            { 
              id: args.id 
            },
             data: args.dto 
          });
      }
    },
  
    deleteProfile: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_obj, args: ProfileArgs, ctx: Context) => {
        return await ctx.prisma.profile.delete(
          { 
            where:
             { 
              id: args.id 
            } 
          });
      }
    },
  }
});
