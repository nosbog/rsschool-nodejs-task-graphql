import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLEnumType, GraphQLScalarType, ValueNode, Kind, GraphQLInputObjectType } from 'graphql';
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

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(types.User),
      args: {
        dto: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'CreateUserInput',
            fields: {
              name: { type: new GraphQLNonNull(GraphQLString) },
              balance: { type: new GraphQLNonNull(GraphQLFloat) },
            },
          })),
        },
      },
    },
    createProfile: {
      type: new GraphQLNonNull(types.Profile),
      args: {
        dto: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'CreateProfileInput',
            fields: {
              isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
              yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
              userId: { type: new GraphQLNonNull(UUID) },
              memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
            },
          })),
        },
      },
    },
    createPost: {
      type: new GraphQLNonNull(types.Post),
      args: {
        dto: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'CreatePostInput',
            fields: {
              title: { type: new GraphQLNonNull(GraphQLString) },
              content: { type: new GraphQLNonNull(GraphQLString) },
              authorId: { type: new GraphQLNonNull(UUID) },
            },
          })),
        },
      },
    },
    changePost: {
      type: new GraphQLNonNull(types.Post),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
        dto: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'ChangePostInput',
            fields: {
              title: { type: GraphQLString },
              content: { type: GraphQLString },
            },
          })),
        },
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(types.Profile),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
        dto: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'ChangeProfileInput',
            fields: {
              isMale: { type: GraphQLBoolean },
              yearOfBirth: { type: GraphQLInt },
              memberTypeId: { type: MemberTypeIdEnum },
            },
          })),
        },
      },
    },
    changeUser: {
      type: new GraphQLNonNull(types.User),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
        dto: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'ChangeUserInput',
            fields: {
              name: { type: GraphQLString },
              balance: { type: GraphQLFloat },
            },
          })),
        },
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUID) },
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUID) },
        authorId: { type: new GraphQLNonNull(UUID) },
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUID) },
        authorId: { type: new GraphQLNonNull(UUID) },
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
}); 