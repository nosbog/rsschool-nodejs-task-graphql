import { Type } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLEnumType,GraphQLNonNull, GraphQLUnionType } from 'graphql';
import { UUIDType } from './types/uuid.js';
import {MemberTypeId, MemberType} from './types/member.js'

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


const Post = new GraphQLObjectType ({
  name: 'post',
  fields: () => ({
    id: {
      type: UUIDType!
    },
    title: {
      type: GraphQLInt
    },
    content: {
      type: GraphQLString
    }  
  })
});

const User = new GraphQLObjectType ({
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
    }  
  })
});

const Profile = new GraphQLObjectType ({
  name: 'profile',
  fields: () => ({
    id: {
      type: UUIDType!
    },
    isMale: {
      type: GraphQLBoolean!
    },
    yearOfBirth: {
      type: GraphQLInt!
    }  
  })
});

const RootQuery  = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {

    memberTypes: {
      type: new GraphQLList(MemberType),
      async resolve (parent, {id}, context) {

        console.log('hello!')

        const  res = await context.prisma.memberType.findMany();

        return res;
      }
    },
    memberType: {
      type: new GraphQLNonNull( MemberType),

      args: {
        id: {type: MemberTypeId}
      },

      async resolve (root, {id}, context, ) {

        console.log('input: ', id);

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
      async resolve (parent, {id}, context) {
        const res = await context.prisma.post.findMany();

        return res;
      }
    },
    users: {
      type: new GraphQLList(User),
      async resolve (parent, {id}, context) {
        const res = await context.prisma.user.findMany();

        return res;
      }
    },
    profiles: {
      type: new GraphQLList(Profile),
      async resolve (parent, {id}, context) {
        const res = await context.prisma.profile.findMany();

        return res;
      }
    }
  }
})

export const gqlSchema = new GraphQLSchema({
  query: RootQuery
});
