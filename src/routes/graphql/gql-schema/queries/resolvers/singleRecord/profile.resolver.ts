import { PrismaClient, Profile } from '@prisma/client';

async function profileResolver(args: Record<string, any>, prisma: PrismaClient): Promise<Profile | null> {
  return await prisma.profile.findUnique({ where: { id: args.id } });
};

export default profileResolver;
