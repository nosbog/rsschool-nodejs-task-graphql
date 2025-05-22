import { PrismaClient } from '@prisma/client';

interface MemberTypesIdArgs {
  memberTypeId: string;
}

export const memberTypesIdResolver = async (
  { memberTypeId }: MemberTypesIdArgs,
  prisma: PrismaClient,
  ) => await prisma.memberType.findUnique({where: { id: memberTypeId }});