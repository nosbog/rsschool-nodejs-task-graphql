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

export const updateUser = async (
  parent: UserEntity,
  args: {
    id: string;
    input: Partial<Omit<UserEntity, 'id' | 'subscribedToUserIds'>>;
  },
  context: FastifyInstance
): Promise<UserEntity | null> => {
  const id = args.id;
  const user = await context.db.users.findOne({ key: 'id', equals: id });
  if (!user) {
    throw new Error('User not found');
  } else {
    const updatedUser = await context.db.users.change(id, args.input);
    return updatedUser;
  }
};

export const updateProfile = async (
  parent: UserEntity,
  args: { id: string; input: Omit<ProfileEntity, 'id' | 'UserId'> },
  context: FastifyInstance
): Promise<ProfileEntity | null> => {
  const { id, input } = args;
  const profile = await context.db.profiles.findOne({
    key: 'id',
    equals: id,
  });
  if (!profile) {
    throw new Error('Profile not found');
  } else {
    const updatedProfile = await context.db.profiles.change(id, input);
    return updatedProfile;
  }
};
