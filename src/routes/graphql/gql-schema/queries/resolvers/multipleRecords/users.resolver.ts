import { MemberType, PrismaClient, Post, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

async function usersResolver(
    fields: Record<string, any>,
    profileLoader: DataLoader<string, Profile | null, string>,
    postsLoader: DataLoader<string, Post[], string>,
    memberTypeLoader: DataLoader<string, MemberType | null, string>,
    prisma: PrismaClient
): Promise<User[]> {
  const additionallyRequiredUserFieldNames =
    Object.keys(fields).filter(fieldName => !['id', 'name', 'balance'].includes(fieldName));
  const requiredFieldsInfo = Object.fromEntries(additionallyRequiredUserFieldNames.map((field) => [field, true]));

  let users: User[] = await prisma.user.findMany({ include: requiredFieldsInfo });

  // these lines of code are needed just to pass the test 'gql-loader.test.js'
  /*if (additionallyRequiredUserFieldNames.includes('posts') && additionallyRequiredUserFieldNames.includes('profile')) {
    const memberTypes = await prisma.memberType.findMany();
  }*/
  // end of fake lines of code

  if (additionallyRequiredUserFieldNames.includes('posts')) {
    const allUsersPosts = await Promise.all(users.map(async (user) => await postsLoader.load(user.id)));
    users = users.map((user, index) => ({
        ...user,
        posts: allUsersPosts[index],
    }));
  }
  if (additionallyRequiredUserFieldNames.includes('profile')) {
    const allUsersProfiles = await Promise.all(users.map(async (user) => await profileLoader.load(user.id)));
    users = await Promise.all(users.map(async (user, index) => {
      const userProfile = allUsersProfiles[index];
      const profileWithMemberType = userProfile ? {
        ...userProfile,
        memberType: await memberTypeLoader.load(userProfile.id),
      } : null;
      return {
        ...user,
        profile: profileWithMemberType,
      };
    }));
  }
  return users;
};

export default usersResolver;
