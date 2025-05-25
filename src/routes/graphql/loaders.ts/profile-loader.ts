import { PrismaClient, Profile } from '@prisma/client';
import DataLoader from 'dataloader';

export const createProfileLoaders = (prisma: PrismaClient) => {
  const profileCache = new Map<string, Profile | null>();
  let allProfilesCache: Profile[] | null = null;

  const allProfilesLoader = new DataLoader<string, Profile[]>(async () => {
    if (allProfilesCache) return [allProfilesCache];
    
    const profiles = await prisma.profile.findMany({
      include: { memberType: true }
    });
    allProfilesCache = profiles;
    
    profiles.forEach(profile => profileCache.set(profile.userId, profile));
    
    return [profiles];
  });

  const profileByIdLoader = new DataLoader<string, Profile | null>(async (profileIds) => {
    const cachedResults = profileIds.map(id => profileCache.get(id));
    
    if (cachedResults.every(profile => profile !== undefined)) {
      return cachedResults as Profile[];
    }

    const missingIds = profileIds.filter((_, index) => cachedResults[index] === undefined);
    const profiles = await prisma.profile.findMany({
      where: { id: { in: missingIds } },
      include: { memberType: true }
    });

    profiles.forEach(profile => profileCache.set(profile.id, profile));
    missingIds.forEach(id => {
      if (!profileCache.has(id)) profileCache.set(id, null);
    });

    return profileIds.map(id => profileCache.get(id) || null);
  });

  const profileByUserIdLoader = new DataLoader<string, Profile | null>(async (userIds) => {
    const cachedResults = userIds.map(userId => profileCache.get(userId));
    
    if (cachedResults.every(profile => profile !== undefined)) {
      return cachedResults as Profile[];
    }

    const missingUserIds = userIds.filter((_, index) => cachedResults[index] === undefined);
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: missingUserIds } },
      include: { memberType: true }
    });

    profiles.forEach(profile => profileCache.set(profile.userId, profile));
    missingUserIds.forEach(userId => {
      if (!profileCache.has(userId)) profileCache.set(userId, null);
    });

    return userIds.map(userId => profileCache.get(userId) || null);
  });

  return {
    allProfiles: allProfilesLoader,
    profileById: profileByIdLoader,
    profileByUserId: profileByUserIdLoader
  };
};
