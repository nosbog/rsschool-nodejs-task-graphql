import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLEnumType, GraphQLNonNull } from "graphql";
import { MemberTypeId } from '../../member-types/schemas.js';

const memberTypeFields = {
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  };
  
  export const MemberType = new GraphQLObjectType({
    name: 'MemberType', 
    fields: memberTypeFields,
  });

  const postTypeFields = {
    id: { type:  new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
  };
  
  export const PostType = new GraphQLObjectType({
    name: 'PostType', 
    fields: postTypeFields,
  });

  const userTypeFields = {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  };
  
  export const UserType = new GraphQLObjectType({
    name: 'UserType', 
    fields: userTypeFields,
  });

  const profileTypeFields = {
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  };
  
  export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType', 
    fields: profileTypeFields,
  });

  const TypeIdValues = {
    'basic': {
      value: MemberTypeId.BASIC
    },
    'business': {
      value: MemberTypeId.BUSINESS
    }
  }

  export const MTIdType = new GraphQLEnumType({
    name: 'MemberTypeId', 
    values: TypeIdValues,
  });
  

  export type Context = {
    prisma: PrismaClient;
  };
