import { FastifyInstance } from 'fastify';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  getMemberTypeById,
  getMemberTypes,
} from '../../actions/memberTypesActions';
import { getPostById, getPosts } from '../../actions/postsActions';
import { getProfileById, getProfiles } from '../../actions/profilesActions';
import { getUserById, getUsers } from '../../actions/usersActions';
import { MemberTypeType, PostType, ProfileType, UserType } from './model';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: {
          description: 'User Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context: FastifyInstance) =>
        getUserById(id, context),
    },
    post: {
      type: PostType,
      args: {
        id: {
          description: 'Post Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context: FastifyInstance) =>
        getPostById(id, context),
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          description: 'Profile Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context: FastifyInstance) =>
        getProfileById(id, context),
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: {
          description: 'MemberType Id',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { id }, context: FastifyInstance) =>
        getMemberTypeById(id, context),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_source, _args, context: FastifyInstance) => getUsers(context),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (_source, _args, context: FastifyInstance) => getPosts(context),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_source, _args, context: FastifyInstance) =>
        getProfiles(context),
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: (_source, _args, context: FastifyInstance) =>
        getMemberTypes(context),
    },
  }),
});
