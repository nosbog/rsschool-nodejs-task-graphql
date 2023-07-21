import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } from 'graphql';
import { UUIDType } from './types/uuid.js';
import {MemberTypeId, MemberType} from './types/member-type.js';
import { CreateUserInput, User } from './types/user.js';
import { CreatePostInput, Post } from './types/post.js';
import { CreateProfileInput, Profile } from './types/profile.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);  

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};


const RootQuery  = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {

    memberTypes: {
      type: new GraphQLList(MemberType),
      async resolve (parent, {id}, context) {

        const  res = await context.prisma.memberType.findMany();

        return res;
      }
    },
    memberType: {
      type: MemberType,
      args: {
        id: {type: new GraphQLNonNull(MemberTypeId)}
      },

      async resolve (parent, { id }, context, ) {

        console.log('memberType id: ', id);

        const res = await context.prisma.memberType.findUnique({
          where: {
            id: id,
          },
        });
        return res;
    
      }
    },

    posts: {
      type: new GraphQLList(Post),
      async resolve (parent, { id }, context) {
        const res = await context.prisma.post.findMany();

        return res;
      }
    },
    post: {
      type: Post,
      args: { 
        id: { type: new GraphQLNonNull(UUIDType) } 
      },
            
      resolve: async (parent, { id }, context) => {

        console.log('post id: ', id);

        return await context.prisma.post.findFirst({
          where: {
            id: id,
          },
        });
      },
    },

    users: {
      type: new GraphQLList(User),
      async resolve (parent, {id}, context) {
        const res = await context.prisma.user.findMany();

        return res;
      }
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {

        console.log('user id: ', id);

        return await context.prisma.user.findFirst({
          where: {
            id: id,
          },
        });
      },
    },
    
    profiles: {
      type: new GraphQLList(Profile),
      async resolve (parent, {id}, context) {
        const res = await context.prisma.profile.findMany();

        return res;
      }
    },
    profile: {
      type: Profile,
      args: { 
        id: { type: new GraphQLNonNull(UUIDType) } 
      },
      resolve: async (parent, { id }, context) => {

        console.log('profile id: ', id);

        const res = await context.prisma.profile.findUnique({
          where: {
            id: id,
          },
        });

        return res;
      },
    },

  }
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createPost: {
      type: Post,
      args: {
        dto: { type: CreatePostInput }
      },
      async resolve (parent, { dto: data }, context) {

        const  res = await context.prisma.post.create({ data });

        return res;
      }

    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      async resolve (parent, { id }, context) {
        try { 
          const  res = await context.prisma.post.delete({ where: { id }});

          return id;
        } catch {
          return null;
        }
      }
      
    },

    createUser: {
      type: User,
      args: {
        dto: { type: CreateUserInput }
      },
      async resolve (parent, { dto: data }, context) {

        const  res = await context.prisma.user.create({ data });

        return res;
      }

    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      async resolve (parent, { id }, context) {
        try { 
          const  res = await context.prisma.user.delete({ where: { id }});

          return id;
        } catch {
          return null;
        }
      }
      
    },

    createProfile: {
      type: Profile,
      args: {
        dto: { type: CreateProfileInput }
      },
      async resolve (parent, { dto: data }, context) {

        const  res = await context.prisma.profile.create({ data });

        return res;
      }

    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      async resolve (parent, { id }, context) {
        try { 
          const  res = await context.prisma.profile.delete({ where: { id }});

          return id;
        } catch {
          return null;
        }
      }
      
    },

  },
});

export const gqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation 
});
