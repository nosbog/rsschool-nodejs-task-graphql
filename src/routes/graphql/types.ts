import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

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
  
export const PostType = new GraphQLObjectType({
    name: "p",
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
  
export const MemberType = new GraphQLObjectType({
    name: "memberType",
    fields: {
      id: { type: GraphQLString },
      discount: { type: GraphQLString },
      monthPostsLimit: { type: GraphQLString },
    }
  });
  