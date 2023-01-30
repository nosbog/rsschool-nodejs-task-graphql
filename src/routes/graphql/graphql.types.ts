import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import { GraphQLInputObjectType } from 'graphql/type';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLInt) },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: {
      type: GraphQLString,
    },
  }),
});
export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString }
  })
});

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id:{ type:GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
})});


export const UsersWithInfoType =  new GraphQLObjectType({
  name:"UsersWithInfo",
  fields:()=> ({
    users:{type:new GraphQLList(UserType)},
    posts:{type:new GraphQLList(PostType)},
    profiles:{type:new GraphQLList(ProfileType)},
    memberTypes:{type:new GraphQLList(MemberType)}
  })
})

export const UserByIdWithInfo = new GraphQLObjectType({
  name:"UserByIdWithInfo",
  fields:()=> ({
    ...UserType.getFields(),
    posts:{type:new GraphQLList(PostType)},
    profile:{type:new GraphQLList(ProfileType)},
    memberType:{type:new GraphQLList(MemberType)}
  })
})

export const UsersWithSubscribesTo = new GraphQLObjectType({
  name:"UsersWithSubscribesTo",
  fields:() => ({
    userSubscribedTo:{type:new GraphQLList(GraphQLString)},
    profile:{type:ProfileType}
  })
})
export const UserByIdWithSubscribesAndPosts = new GraphQLObjectType({
  name:"UserByIdWithSubscribesAndPosts",
  fields:() => ({
    subscribedToUser:{type:new GraphQLList(GraphQLString)},
    posts:{type:new GraphQLList(PostType)}
  })
})
export const UsersWithSubsAndSubscribesType = new GraphQLObjectType({
  name:"UsersWithSubsAndSubscribesType",
  fields:() => ({
    subscribedToUser:{type:new GraphQLList(GraphQLString)},
    userSubscribedTo:{type:new GraphQLList(GraphQLString)}
  })
})


export const PostInputType = new GraphQLInputObjectType({
  name:"InputPost",
  fields:() => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString }
  })
})
export const ProfileInputType = new GraphQLInputObjectType({
  name:"ProfileInput",
  fields:() => ({
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: {
      type: GraphQLString,
    },
  })
})