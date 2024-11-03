import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";

export const MemberTypeEnum = new GraphQLEnumType({
  name: "MemberTypeEnum",
  description: "One of the member types",
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
      description: "Basic level, no preferences",
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
      description: "Business level with biggest ROI",
    },
  },
});

export const MemberType = new GraphQLObjectType({
  name: "Member",
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
