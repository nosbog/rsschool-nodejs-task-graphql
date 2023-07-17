export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface User {
  id: string;
  name: string;
  balance: number;
}

export interface MemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}
