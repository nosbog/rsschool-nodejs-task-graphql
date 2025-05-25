import { Post, Profile, User, MemberType } from '@prisma/client';
import DataLoader from 'dataloader';

export interface Loaders {
  allUsers: DataLoader<string | Record<string, boolean>, User[]>;
  userById: DataLoader<string, User>;
  allPosts: DataLoader<string, Post[]>;
  postsByUser: DataLoader<string, Post[]>;
  postById: DataLoader<string, Post | null>;
  allProfiles: DataLoader<string, Profile[]>;
  profileById: DataLoader<string, Profile | null>;
  profileByUserId: DataLoader<string, Profile | null>;
  userSubscribedTo: DataLoader<string, User[]>;
  subscribedToUser: DataLoader<string, User[]>;
  allMemberTypes: DataLoader<string, MemberType[]>;
  memberTypeById: DataLoader<string, MemberType | null>;
}