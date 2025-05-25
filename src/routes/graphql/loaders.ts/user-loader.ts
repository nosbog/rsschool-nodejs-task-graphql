import { PrismaClient, User } from "@prisma/client";
import DataLoader from "dataloader";

export const createUserLoaders = (prisma: PrismaClient) => {
  const userCache = new Map<string, User>();
  
  const allUsersLoader = new DataLoader<string | Record<string, boolean>, User[]>(async (includeOptions) => {
    const includeObject = includeOptions[0] && typeof includeOptions[0] === 'object' ? includeOptions[0] : {};
    
    const users = await prisma.user.findMany({
      include: includeObject
    });
    
    users.forEach(user => userCache.set(user.id, user));

    return [users];
  });

  const userByIdLoader = new DataLoader<string, User>(async (ids) => {
    const cachedUsers = ids.map(id => userCache.get(id));
    const missingIds = ids.filter((_, i) => !cachedUsers[i]);
    
    if (missingIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: missingIds } },
        include: {
          posts: true,
          profile: {
            include: {
              memberType: true,
            }
          }
        }
      });

      users.forEach(user => userCache.set(user.id, user));
    }

    return ids.map(id => userCache.get(id)!);
  });

  return {
    allUsers: allUsersLoader,
    userById: userByIdLoader
  };
};