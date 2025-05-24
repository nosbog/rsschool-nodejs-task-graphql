import {
  changeUserInputDto,
  Context,
  createUserInputDto,
  User,
} from '../ts-types.js';

export const getAllUsers = async (
  _parent: unknown,
  _args: unknown,
  { prisma }: Context,
) => {
  return prisma.user.findMany();
};

export const getUser = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma }: Context,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      profile: true,
      posts: true,
      userSubscribedTo: true,
      subscribedToUser: true,
    },
  });
  return user;
};

export const getSubscriptions = async (
  { userSubscribedTo }: User,
  _args: unknown,
  { prisma }: Context,
) => {
  const subscriptions = userSubscribedTo.map(({ authorId }) => authorId);
  return await prisma.user.findMany({
    where: { id: { in: subscriptions } },
    include: {
      profile: true,
      posts: true,
      userSubscribedTo: true,
      subscribedToUser: true,
    },
  });
};

export const getSubscribers = async (
  { subscribedToUser }: User,
  _args: unknown,
  { prisma }: Context,
) => {
  const subscribers = subscribedToUser.map(({ subscriberId }) => subscriberId);
  return await prisma.user.findMany({
    where: { id: { in: subscribers } },
    include: {
      profile: true,
      posts: true,
      userSubscribedTo: true,
      subscribedToUser: true,
    },
  });
};

export const deleteUser = async (
  _parent: unknown,
  { id }: { id: string },
  { prisma }: Context,
) => {
  await prisma.user.delete({ where: { id } });
  return 'Deleted succesfully!';
};

export const createUser = async (
  _parent: unknown,
  { dto }: { dto: createUserInputDto },
  { prisma }: Context,
) => {
  const user = await prisma.user.create({
    data: dto,
  });
  console.log(user);
  return user;
};

export const updateUser = async (
  _parent: unknown,
  { dto, id }: { dto: changeUserInputDto; id: string },
  { prisma }: Context,
) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: dto,
  });
  return user;
};

export const subscribeTo = async (
  _parent: unknown,
  { userId, authorId }: { userId: string; authorId: string },
  { prisma }: Context,
) => {
  await prisma.subscribersOnAuthors.create({
    data: {
      subscriberId: userId,
      authorId,
    },
  });

  return 'Subscribed successfully';
};

export const unsubscribeFrom = async (
  _parent: unknown,
  { userId, authorId }: { userId: string; authorId: string },
  { prisma }: Context,
) => {
  await prisma.subscribersOnAuthors.delete({
    where: {
      subscriberId_authorId: {
        subscriberId: userId,
        authorId,
      },
    },
  });
  return 'Unsubscribed successfully';
};
