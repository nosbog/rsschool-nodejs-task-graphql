import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MemberResolver = {
  memberType: async ({ id }: { id: string }) => {
    const member = await prisma.memberType.findUnique({ where: { id } });
    return member;
  },
  memberTypes: async () => {
    return await prisma.memberType.findMany();
  },
};
