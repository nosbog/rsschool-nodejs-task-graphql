import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt } from "graphql";

const memberTypeFields = {
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  };
  
  export const MemberType = new GraphQLObjectType({
    name: 'MemberType', 
    fields: memberTypeFields,
  });


  export type Context = {
    prisma: PrismaClient;
  };
