import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const User = new GraphQLObjectType({
    name: "user",
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList ( GraphQLString ) }
    }
  });

export const createUserType = new GraphQLInputObjectType({
    name: "userCreateType",
    fields: () => ({
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
    }),
});

export const updateUserType = new GraphQLInputObjectType({
    name: "userUpdateType",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
    }),
});

export const Profile = new GraphQLObjectType({
    name: "profile",
    fields: {
      id: { type: GraphQLString },
      avatar: { type: GraphQLString },
      sex: { type: GraphQLString },
      birthday: { type: GraphQLString },
      country: { type: GraphQLString },
      street: { type: GraphQLString },
      city: { type: GraphQLString },
      memberTypeId: { type: GraphQLString },
      userId: { type: GraphQLString },
    }
  });

export const createProfile = new GraphQLInputObjectType({
    name: "profileCreateType",
    fields: () => ({
      avatar: { type: new GraphQLNonNull(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      sex: { type: new GraphQLNonNull(GraphQLString) },
      birthday: { type: new GraphQLNonNull(GraphQLInt) },
      country: { type: new GraphQLNonNull(GraphQLString) },
      street: { type: new GraphQLNonNull(GraphQLString) },
      city: { type: new GraphQLNonNull(GraphQLString) },
      memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const updateProfile = new GraphQLInputObjectType({
    name: "profileUpdateType",
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      avatar: { type: new GraphQLNonNull(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      sex: { type: new GraphQLNonNull(GraphQLString) },
      birthday: { type: new GraphQLNonNull(GraphQLInt) },
      country: { type: new GraphQLNonNull(GraphQLString) },
      street: { type: new GraphQLNonNull(GraphQLString) },
      city: { type: new GraphQLNonNull(GraphQLString) },
      memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const PostType = new GraphQLObjectType({
    name: "post",
    fields: {
      id: { type: GraphQLString },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      userId: { type: GraphQLString },
    }
});

export const createPostType = new GraphQLInputObjectType({
    name: "postCreateType",
    fields: () => ({
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString)},
      userId: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const updatePostType = new GraphQLInputObjectType({
    name: "postUpdateType",
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString)},
    }),
});
  
export const MemberType = new GraphQLObjectType({
    name: "memberType",
    fields: {
      id: { type: GraphQLString },
      discount: { type: GraphQLString },
      monthPostsLimit: { type: GraphQLString },
    }
  });
  