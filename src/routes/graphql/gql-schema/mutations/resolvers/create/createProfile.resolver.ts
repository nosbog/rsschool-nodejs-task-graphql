import { PrismaClient } from '@prisma/client';

async function createProfileResolver(args: Record<string, any>, prisma: PrismaClient) {
    return await prisma.profile.create({ data: args.dto });
}

export default createProfileResolver;
