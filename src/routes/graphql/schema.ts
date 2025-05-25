import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

// MemberTypeId Enum
const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

// MemberType Object Type
const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello GraphQL!',
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: async (parent, args, context) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.memberType.findUnique({
          where: { id: args.id }
        });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, context) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.user.findUnique({
          where: { id: args.id }
        });
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
});