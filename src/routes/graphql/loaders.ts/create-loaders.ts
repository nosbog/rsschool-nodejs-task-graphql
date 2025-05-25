import { PrismaClient } from "@prisma/client";

import { createPostLoaders } from "./posts-loader.js";
import { createProfileLoaders } from "./profile-loader.js";
import { subscriptionsLoader } from "./subscriptions-loader.js";
import { createUserLoaders } from "./user-loader.js";
import { createMemberTypeLoaders } from "./member-type-loader.js";

import type { Loaders } from "../types/loaders.js";

export const createLoaders = (prisma: PrismaClient): Loaders => {
  const postLoaders = createPostLoaders(prisma);
  const memberTypeLoaders = createMemberTypeLoaders(prisma);
  const usersLoaders = createUserLoaders(prisma);
  const profilesLoaders = createProfileLoaders(prisma);

  
  return {
    allUsers: usersLoaders.allUsers,
    userById: usersLoaders.userById,
    allPosts: postLoaders.allPosts,
    postsByUser: postLoaders.postsByUser,
    postById: postLoaders.postById,
    allProfiles: profilesLoaders.allProfiles,
    profileById: profilesLoaders.profileById,
    profileByUserId: profilesLoaders.profileByUserId,
    allMemberTypes: memberTypeLoaders.allMemberTypes,
    memberTypeById: memberTypeLoaders.memberTypeById,
    ...subscriptionsLoader(prisma),
  };
};