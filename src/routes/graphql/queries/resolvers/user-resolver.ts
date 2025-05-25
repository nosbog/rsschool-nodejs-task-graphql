import { Loaders } from '../../types/loaders.js';

export const userResolver = async (args: Record<string, string>, loaders: Loaders) => {
  const user = await loaders.userById.load(args.id)

  if (!user) return null;

  const [
    posts,
    profile,
    userSubscribedTo,
    subscribedToUser
  ] = await Promise.all([
    loaders.postsByUser.load(user.id),
    loaders.profileByUserId.load(user.id),
    loaders.userSubscribedTo.load(user.id),
    loaders.subscribedToUser.load(user.id)
  ]);

  const memberType = profile?.memberTypeId
    ? await loaders.memberTypeById.load(profile.memberTypeId)
    : null;

  return {
    ...user,
    posts,
    profile: profile ? {
      ...profile,
      memberType
    } : null,
    userSubscribedTo: userSubscribedTo.map(author => ({
      ...author,
      subscribedToUser: loaders.subscribedToUser.load(author.id)
    })),
    subscribedToUser: subscribedToUser.map(subscriber => ({
      ...subscriber,
      userSubscribedTo: loaders.userSubscribedTo.load(subscriber.id)
    }))
  };
};
