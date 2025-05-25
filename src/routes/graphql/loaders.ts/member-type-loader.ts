import { PrismaClient, MemberType } from '@prisma/client';
import DataLoader from 'dataloader';

export const createMemberTypeLoaders = (prisma: PrismaClient) => {
  const memberTypeCache = new Map<string, MemberType>();
  let allMemberTypesCache: MemberType[] | null = null;

  const allMemberTypesLoader = new DataLoader<string, MemberType[]>(async () => {
    if (allMemberTypesCache) return [allMemberTypesCache];
    
    const memberTypes = await prisma.memberType.findMany();
    allMemberTypesCache = memberTypes;
    
    memberTypes.forEach(mt => memberTypeCache.set(mt.id, mt));
    
    return [memberTypes];
  });

  const memberTypeByIdLoader = new DataLoader<string, MemberType | null>(async (ids) => {
    const cachedResults = ids.map(id => memberTypeCache.get(id));
    
    if (cachedResults.every(mt => mt !== undefined)) {
      
      return cachedResults as MemberType[];
    }

    const missingIds = ids.filter((_, index) => cachedResults[index] === undefined);
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: missingIds } }
    });

    memberTypes.forEach(mt => memberTypeCache.set(mt.id, mt));
    return ids.map(id => memberTypeCache.get(id) || null);
  });

  return {
    allMemberTypes: allMemberTypesLoader,
    memberTypeById: memberTypeByIdLoader
  };
};