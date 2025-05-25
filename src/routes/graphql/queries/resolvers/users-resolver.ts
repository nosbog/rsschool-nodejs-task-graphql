import { Loaders } from '../../types/loaders.js';

export const usersResolver = async (
  loaders: Loaders,
  fields: Record<string, unknown>,
) => {
  const optionsKeys = Object.keys(fields);

  const includeOptions: Record<string, boolean> = Object.fromEntries(
    optionsKeys
      .filter(field => !['id', 'name', 'balance'].includes(field))
      .map(field => [field, true]),
  );

  const users = await loaders.allUsers.load(includeOptions);

  const profileBatch = optionsKeys.includes('profile')
    ? users.map(user => loaders.profileByUserId.load(user.id))
    : [];

  const postsBatch = optionsKeys.includes('posts')
    ? users.map(user => loaders.postsByUser.load(user.id))
    : [];
  
  const userSubscribedToBatch = optionsKeys.includes('userSubscribedTo') 
    ? users.map(user => loaders.userSubscribedTo.load(user.id)) 
    : [];
  const subscribedToUserBatch = optionsKeys.includes('subscribedToUser') 
    ? users.map(user => loaders.subscribedToUser.load(user.id)) 
    : [];

  const [
    profiles,
    posts,
    userSubscribedTo,
    subscribedToUser,
    memberTypes
  ] = await Promise.all([
    profileBatch ? Promise.all(profileBatch) : Promise.resolve([]),
    postsBatch ? Promise.all(postsBatch) : Promise.resolve([]),
    userSubscribedToBatch ? Promise.all(userSubscribedToBatch) : Promise.resolve([]),
    subscribedToUserBatch ? Promise.all(subscribedToUserBatch) : Promise.resolve([]),
    loaders.allMemberTypes.load('all'),
  ]);

  const usersResult = users.map((user, index) => {
    const profile = profiles[index];

    return {
    ...user,
    profile: profile
      ? {
          ...profile,
          memberType: profile.memberTypeId ? memberTypes.find(mt => mt.id === profile.memberTypeId) : null,
        }
      : null,
    posts: posts[index],
    userSubscribedTo: optionsKeys.includes('userSubscribedTo') ? userSubscribedTo[index] : undefined,
    subscribedToUser: optionsKeys.includes('subscribedToUser') ? subscribedToUser[index] : undefined,
  };
  });

  return usersResult;
};
