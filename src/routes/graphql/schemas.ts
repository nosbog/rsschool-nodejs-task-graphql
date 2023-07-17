import { Type } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLFloat, GraphQLObjectType, GraphQLInt, GraphQLSchema, GraphQLString, GraphQLID } from 'graphql';

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

 const UserType = new GraphQLObjectType({
   name: "User",
   fields: () => ({
     id: {type: GraphQLID},
     name: {type: GraphQLString},
     balance: {type: GraphQLFloat},
     profile: {type: ProfileType},
     posts: {type: PostType}
    // profile: {},
    // posts: {},
    // userSubscribedTo: {},
    // subscribedToUser: {}
   })
 })

const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: {type: UserType},   
    author: {type: UserType},  
  }) 
})

const ProfileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: {type: GraphQLID},
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},

   // profile: {},
   // posts: {},
   // userSubscribedTo: {},
   // subscribedToUser: {}
  })
})

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    author: {type: UserType},
  })
})

const MemberType = new GraphQLObjectType({
  name: "Member",
  fields: () => ({
    id: {type: GraphQLID},
    discount: {type: GraphQLFloat},
    postsLimitPerMonth: {type: GraphQLInt},
    profiles: {type: ProfileType},
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve: (parent, args) => {
        return args.id
      } 
    }
  })
})

export const schema = new GraphQLSchema({
  query: RootQuery
})

