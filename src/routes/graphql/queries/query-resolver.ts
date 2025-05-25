
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { parseResolveInfo, ResolveTree } from "graphql-parse-resolve-info";
import { simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";

import { usersResolver } from "./resolvers/users-resolver.js";
import { profileType } from "../types/entities/profile-type.js";
import { postType } from "../types/entities/post-type.js";
import { UUIDType } from "../types/uuid.js";
import { memberType, memberTypeId } from "../types/entities/member-type.js";
import { userType } from "../types/entities/user-type.js";
import { Loaders } from "../types/loaders.js";
import { userResolver } from "./resolvers/user-resolver.js";

export const queryResolver = (
  loaders: Loaders
) => {
  return new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      users: {
        type: new GraphQLList(userType),
        resolve: async (_, __, ___, resolveInfo) => {
          const parsedResolveInfo = parseResolveInfo(resolveInfo) as ResolveTree;
          const { fields } = simplifyParsedResolveInfoFragmentWithType(
            parsedResolveInfo,
            userType,
          );
          
          return usersResolver(loaders, fields);
        },
      },

      user: {
        type: userType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, args: { id: string }) => userResolver(args, loaders),
      },

      profiles: {
        type: new GraphQLList(profileType),
        resolve: async () => await loaders.allProfiles.load('all'),
      },

      profile: {
        type: profileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }: { id: string }) => loaders.profileById.load(id),
      },

      posts: {
        type: new GraphQLList(postType),
        resolve: async () => await loaders.allPosts.load('all'),
      },

      post: {
        type: postType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }: { id: string }) => loaders.postById.load(id),
      },

      memberTypes: {
        type: new GraphQLList(memberType),
        resolve: async () => await loaders.allMemberTypes.load('all'),
      },

      memberType: {
        type: memberType,
        args: {
          id: { type: new GraphQLNonNull(memberTypeId) },
        },
        resolve: async (_, { id }: { id: string }) => loaders.memberTypeById.load(id),
      },
    })
  })
}