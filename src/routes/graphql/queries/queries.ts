import  {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
} from "graphql";
import { UserType } from "../types/user.js";

export const Queries = new GraphQLObjectType({
  name: "QueryType",
  fields: {
    //
  },
});