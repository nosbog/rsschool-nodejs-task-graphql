import { FastifyInstance } from 'fastify';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { getAllMemberTypes, getMemberType } from '../../api/memberTypeApi.js';
import {
  GraphQLMemberType,
  GraphQLPostType,
  GraphQLProfileType,
  GraphQLUserType,
  MemberTypeId,
} from './queryTypes.js';
import { getAllPosts, getPost } from '../../api/postApi.js';
import { getAllProfiles, getProfile } from '../../api/profilesApi.js';
import { getAllUsers, getUser } from '../../api/userApi.js';
import { UUIDType } from '../../types/uuid.js';
import { MemberTypeId as MemberTypeIdEnum } from '../../../member-types/schemas.js';

export const getQueryType = async (
  fastify: FastifyInstance,
): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: 'root',
    fields: {
      memberTypes: {
        type: new GraphQLList(GraphQLMemberType),
        resolve: () => getAllMemberTypes(fastify),
      },
      memberType: {
        type: GraphQLMemberType,
        args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
        resolve: (_, { id }: { id: MemberTypeIdEnum }) => getMemberType(id, fastify),
      },
      posts: {
        type: new GraphQLList(GraphQLPostType),
        resolve: () => getAllPosts(fastify),
      },
      post: {
        type: GraphQLPostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_, { id }: { id: string }) => getPost(id, fastify),
      },
      profiles: {
        type: new GraphQLList(GraphQLProfileType),
        resolve: () => getAllProfiles(fastify),
      },
      profile: {
        type: GraphQLProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_, { id }: { id: string }) => getProfile(id, fastify),
      },
      users: {
        type: new GraphQLList(new GraphQLNonNull(GraphQLUserType)),
        resolve: () => getAllUsers(fastify),
      },
      user: {
        type: GraphQLUserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_, { id }: { id: string }) => getUser(id, fastify),
      },
    },
  });
