import { PrismaClient, MemberType } from '@prisma/client';

async function memberTypesResolver(prisma: PrismaClient): Promise<MemberType[]> {
    return await prisma.memberType.findMany();
}

export default memberTypesResolver;
