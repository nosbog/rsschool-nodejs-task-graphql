import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { FastifyInstance } from 'fastify';

export const getAllUsers = async (
  parent: unknown,
  args: unknown,
  context: FastifyInstance
): Promise<UserEntity[]> => {
  return await context.db.users.findMany();
};

export const getUser = async (
  parent: unknown,
  args: { id: string },
  context: FastifyInstance
): Promise<UserEntity | null> => {
  const user = await context.db.users.findOne({
    key: 'id',
    equals: args.id,
  });
  if (user) return user;
  throw new Error('User not found');
};

export const getAllPosts = async (
  parent: unknown,
  args: unknown,
  context: FastifyInstance
): Promise<PostEntity[]> => {
  return await context.db.posts.findMany();
};

export const getPost = async (
  parent: unknown,
  args: { id: string },
  context: FastifyInstance
): Promise<PostEntity | null> => {
  const post = await context.db.posts.findOne({
    key: 'id',
    equals: args.id,
  });
  if (post) return post;
  throw new Error('Post not found');
};

export const getAllProfiles = async (
  parent: unknown,
  args: unknown,
  context: FastifyInstance
): Promise<ProfileEntity[]> => {
  return await context.db.profiles.findMany();
};

export const getProfile = async (
  parent: unknown,
  args: { id: string },
  context: FastifyInstance
): Promise<ProfileEntity | null> => {
  const profile = await context.db.profiles.findOne({
    key: 'id',
    equals: args.id,
  });
  if (profile) return profile;
  throw new Error('Profile not found');
};

export const getAllMemberTypes = async (
  parent: unknown,
  args: unknown,
  context: FastifyInstance
): Promise<MemberTypeEntity[]> => {
  return await context.db.memberTypes.findMany();
};

export const getMemberType = async (
  parent: unknown,
  args: { id: string },
  context: FastifyInstance
): Promise<MemberTypeEntity | null> => {
  const memberType = await context.db.memberTypes.findOne({
    key: 'id',
    equals: args.id,
  });
  if (memberType) return memberType;
  throw new Error('MemberType not found');
};