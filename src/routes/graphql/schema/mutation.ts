import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserType } from "../types/user.js";
import { UUIDType } from "../types/uuid.js";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:  {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  },
});