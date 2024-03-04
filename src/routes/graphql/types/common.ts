import { PrismaClient } from '@prisma/client';

export interface Context {
  prisma: PrismaClient;
}

export interface ID {
  id: string;
}

export interface CreatePost {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

export interface ChangePost {
  id: string;
  dto: {
    title: string;
    content: string;
  };
}

export interface CreateProfile {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
}

export interface ChangeProfile {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
}

export interface CreateUser {
  dto: {
    name: string;
    balance: number;
  };
}

export interface ChangeUser {
  id: string;
  dto: {
    name: string;
    balance: number;
  };
}

export interface UserSubscribedTo {
  userId: string;
  authorId: string;
}