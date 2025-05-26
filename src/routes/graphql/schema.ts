import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLEnumType, GraphQLScalarType, ValueNode, Kind } from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';

const UUID = new GraphQLScalarType({
  name: 'UUID',
  description: 'UUID custom scalar type',
  serialize(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('UUID must be a string');
    }
    return value;
  },
  parseValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('UUID must be a string');
    }
    return value;
  },
  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    throw new Error('UUID must be a string');
  },
});

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: MemberTypeId.BASIC },
    BUSINESS: { value: MemberTypeId.BUSINESS },
  },
});

interface GraphQLTypes {
  User: GraphQLObjectType;
  Post: GraphQLObjectType;
  Profile: GraphQLObjectType;
  MemberType: GraphQLObjectType;
}

// Define types with circular dependencies
const types: GraphQLTypes = {
  User: new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
      profile: { type: types.Profile },
      posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.Post))) },
      userSubscribedTo: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.User))) },
      subscribedToUser: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.User))) },
    }),
  }),
  Post: new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUID) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      author: { type: new GraphQLNonNull(types.User) },
    }),
  }),
  Profile: new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUID) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      user: { type: new GraphQLNonNull(types.User) },
      userId: { type: new GraphQLNonNull(UUID) },
      memberType: { type: new GraphQLNonNull(types.MemberType) },
      memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    }),
  }),
  MemberType: new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
      profiles: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.Profile))) },
    }),
  }),
};

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.MemberType))),
    },
    memberType: {
      type: types.MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.Post))),
    },
    post: {
      type: types.Post,
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.User))),
    },
    user: {
      type: types.User,
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(types.Profile))),
    },
    profile: {
      type: types.Profile,
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: Query,
}); 