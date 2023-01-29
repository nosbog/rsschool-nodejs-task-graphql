import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';
import { FastifyInstance } from 'fastify';

export const getAllProfiles = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<ProfileEntity[]> => {
  return await context.db.profiles.findMany();
};

export const getProfile = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<ProfileEntity | null> => {
  return await context.db.profiles.findOne({
    key: 'userId',
    equals: parent.id,
  });
};

export const getAllPosts = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<PostEntity[]> => {
  return await context.db.posts.findMany({
    key: 'userId',
    equals: parent.id,
  });
};

export const getMemberType = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<MemberTypeEntity | null> => {
  const profile = await context.db.profiles.findOne({
    key: 'userId',
    equals: parent.id,
  });
  if (profile) {
    const memberType = await context.db.memberTypes.findOne({
      key: 'id',
      equals: profile.memberTypeId,
    });
    return memberType;
  }
  return null;
};

export const getAllMemberTypes = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<MemberTypeEntity[]> => {
  return await context.db.memberTypes.findMany();
};

export const getUserSubscribedTo = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<UserEntity[]> => {
  return await context.db.users.findMany({
    key: 'id',
    equalsAnyOf: parent.subscribedToUserIds,
  });
};

export const getSubscribedToUser = async (
  parent: UserEntity,
  args: unknown,
  context: FastifyInstance
): Promise<UserEntity[]> => {
  return await context.db.users.findMany({
    key: 'subscribedToUserIds',
    inArray: parent.id,
  });
};
