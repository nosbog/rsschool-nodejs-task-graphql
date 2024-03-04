import { UUID } from 'crypto';

export interface Post {
  dto: {
    title: string;
    content: string;
    authorId: UUID;
  };
}

export interface User {
  dto: {
    name: string;
    balance: number;
  };
}

export interface Profile {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: UUID;
    userId: UUID;
  };
}

export interface UpdatePost {
  title: string;
  content: string;
  authorId: UUID;
}

export interface UpdateUser {
  name: string;
  balance: number;
}

export interface UpdateProfile {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: UUID;
  userId: UUID;
}

interface MemberType {
  id: void;
  discount: number;
  postsLimitPerMonth: number;
}

interface ProfileType {
  id: UUID;
  isMale: boolean;
  yearOfBirth: number;
  userId: UUID;
  memberTypeId: 'basic' | 'business';
  memberType: MemberType;
}

interface PostType {
  id: UUID;
  title: string;
  content: string;
  authorId: UUID;
}

interface SubscribedType {
  subscriberId?: UUID;
  authorId: UUID;
}

interface SubscribedToUserType {
  subscriber: {
    id: UUID;
    name: string;
    balance: number;
    userSubscribedTo: SubscribedType[];
  };
}

interface AuthorType {
  author: {
    id: UUID;
    name: string;
    balance: number;
    subscribedToUser: SubscribedType[];
  };
}

export interface BasicUserType {
  id: UUID | null;
  name: string;
  balance: number;
  profile: null | ProfileType;
  posts: PostType[];
  subscribedToUser?: SubscribedToUserType[] | null;
  userSubscribedTo?: AuthorType[] | null;
}

interface ToXSubscribedType {
  authorId: UUID;
  subscriberId: UUID;
}

export interface XUserType {
  id: UUID;
  name: string;
  balance: number;
  profile: null | ProfileType;
  posts: PostType[];
  userSubscribedTo: ToXSubscribedType[];
  subscribedToUser: ToXSubscribedType[];
}

export interface FindManyType {
  profile: { include: { memberType: boolean } };
  posts: boolean;
  subscribedToUser?: boolean;
  userSubscribedTo?: boolean;
}
