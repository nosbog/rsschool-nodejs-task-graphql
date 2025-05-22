import { PrismaClient } from '@prisma/client';

interface ProfilesIdArgs {
  profileId : string;
}

export const memberTypesIdResolver = async (
  { profileId  }: ProfilesIdArgs,
  prisma: PrismaClient,
  ) => await prisma.memberType.findUnique({where: { id: profileId  }});