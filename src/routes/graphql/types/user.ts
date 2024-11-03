import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../../../../dist/routes/graphql/types/uuid.js";

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: new GraphQLNonNull(UUIDType)},
    name: { type: GraphQLString},
    balance: { type: GraphQLFloat},
  }),

})