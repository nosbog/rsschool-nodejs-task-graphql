/* eslint-disable @typescript-eslint/no-unsafe-return */
import { MemberType, PrismaClient } from '@prisma/client';
import { Static } from '@sinclair/typebox';
import DataLoader from 'dataloader';
import { userSchema } from '../users/schemas.ts';
import { profileSchema } from '../profiles/schemas.ts';
import { postSchema } from '../posts/schemas.ts';
import { memberTypeSchema } from '../member-types/schemas.ts';

export type UserBody = Static<typeof userSchema>;
export type ProfileBody = Static<typeof profileSchema>;
export type PostBody = Static<typeof postSchema>;
export type MemberTypeBody = Static<typeof memberTypeSchema>;

export const getLoader = (prisma: PrismaClient) => {
  const profileLoader = new DataLoader<string, ProfileBody>(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
    });

    const profileMap: Record<string, ProfileBody> = {};
    profiles.map((profile) => {
      profileMap[profile.userId] = profile;
    });
    return userIds.map((key) => profileMap[key] ?? null);
  });

  const postLoader = new DataLoader<string, PostBody[] | null>(async (userIds) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...userIds],
        },
      },
    });
    const postMap: Record<string, PostBody[] | null> = {};
    posts.forEach((post) => {
      if (postMap[post.authorId]) {
        postMap[post.authorId]?.push(post);
      } else {
        postMap[post.authorId] = [post];
      }
    });
    return userIds.map((key) => postMap[key] ?? null);
  });

  const memberTypeLoader = new DataLoader<string, MemberType>(async (memberTypeIds) => {
    const members = await prisma.memberType.findMany({
      where: {
        profiles: {
          some: {
            memberTypeId: {
              in: [...memberTypeIds],
            },
          },
        },
      },
    });
    return members;
  });
  return { profileLoader, postLoader, memberTypeLoader };
};
