import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberTypeId, MemberTypeType } from '../types/memberType.js';
import {
  getAllMemberTypes,
  getMemberType,
} from '../resolvers/MemberType.resolver.js';
import { getAllUsers, getUser } from '../resolvers/User.resolver.js';
import { UUIDType } from '../types/uuid.js';
import { PostType } from '../types/post.js';
import { getAllPosts, getPost } from '../resolvers/Post.resolver.js';
import { ProfileType } from '../types/profile.js';
import { getAllProfiles, getProfile } from '../resolvers/Profile.resolver.js';
import { UserType } from '../types/user.js';

export const QueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      description: 'Fetch all member types',
      resolve: getAllMemberTypes,
    },
    memberType: {
      type: MemberTypeType,
      description: 'Fetch a member type by ID',
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: getMemberType,
    },
    users: {
      type: new GraphQLList(UserType),
      description: 'Fetch all users',
      resolve: getAllUsers,
    },
    user: {
      type: UserType,
      description: 'Fetch a user by ID',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: getUser,
    },
    posts: {
      type: new GraphQLList(PostType),
      description: 'Fetch all posts',
      resolve: getAllPosts,
    },
    post: {
      type: PostType,
      description: 'Fetch a post by ID',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: getPost,
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      description: 'Fetch all profiles',
      resolve: getAllProfiles,
    },
    profile: {
      type: ProfileType,
      description: 'Fetch a profile by ID',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: getProfile,
    },
  }),
});
