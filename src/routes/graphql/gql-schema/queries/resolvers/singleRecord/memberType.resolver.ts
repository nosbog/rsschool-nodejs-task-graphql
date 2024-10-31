import { PrismaClient, MemberType } from '@prisma/client';

async function memberTypeResolver(args: Record<string, any>, prisma: PrismaClient): Promise<MemberType | null> {
  return await prisma.memberType.findUnique({ where: { id: args.id } });
};

export default memberTypeResolver;
