import { PrismaClient } from '@prisma/client';

async function createUserResolver(args: Record<string, any>, prisma: PrismaClient) {
    return await prisma.user.create({ data: args.dto });
}

export default createUserResolver;
