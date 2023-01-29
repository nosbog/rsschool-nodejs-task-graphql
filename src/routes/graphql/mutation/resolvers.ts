import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { FastifyInstance } from 'fastify';

export const createUser = async (
  parent: UserEntity,
  args: { input: Omit<UserEntity, 'id' | 'subscribedToUserIds'> },
  context: FastifyInstance
): Promise<UserEntity | null> => {
  return await context.db.users.create(args.input);
};

export const createProfile = async (
  parent: UserEntity,
  args: { input: Omit<ProfileEntity, 'id'> },
  context: FastifyInstance
): Promise<ProfileEntity | null> => {
  return await context.db.profiles.create(args.input);
};

export const createPost = async (
  parent: UserEntity,
  args: { input: Omit<PostEntity, 'id'> },
  context: FastifyInstance
): Promise<PostEntity | null> => {
  return await context.db.posts.create(args.input);
};
