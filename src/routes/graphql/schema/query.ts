import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserType } from "../types/user.js";
import { UUIDType } from "../types/uuid.js";
import { PostType } from "../types/post.js";
import { MemberType, MemberTypeEnum } from "../types/member.js";

export const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeEnum) },
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    users: {
      type: new GraphQLList(UserType),
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    posts: {
      type: new GraphQLList(PostType),
    },
  },
});
