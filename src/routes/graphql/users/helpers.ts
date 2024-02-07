export const getUserSubscriptions = async (prisma, userId) => {
  const subscriptions = await _getSubscriptions(prisma, userId);

  const updatedSubscriptions = await Promise.all(
    subscriptions.map(async (user) => {
      const userSubscribedTo = await _getSubscriptions(prisma, user.id);
      const subscribedToUser = await _getSubscribers(prisma, user.id);

      return {
        ...user,
        userSubscribedTo,
        subscribedToUser,
      };
    }),
  );

  return updatedSubscriptions;
};

export const getUserSubscribers = async (prisma, userId) => {
  const subscribers = await _getSubscribers(prisma, userId);

  const updatedSubscribers = await Promise.all(
    subscribers.map(async (user) => {
      const userSubscribedTo = await _getSubscriptions(prisma, user.id);
      const subscribedToUser = await _getSubscribers(prisma, user.id);

      return {
        ...user,
        userSubscribedTo,
        subscribedToUser,
      };
    }),
  );

  return updatedSubscribers;
};

const _getSubscriptions = async (prisma, userId) => {
  return await prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: userId,
        },
      },
    },
  });
};

const _getSubscribers = async (prisma, userId) => {
  return await prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: userId,
        },
      },
    },
  });
};
