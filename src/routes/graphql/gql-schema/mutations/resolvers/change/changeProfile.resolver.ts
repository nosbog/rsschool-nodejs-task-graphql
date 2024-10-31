import { PrismaClient } from '@prisma/client';

async function changeProfileResolver(args: Record<string, any>, prisma: PrismaClient) {
    return await prisma.profile.update({
        where: { id: args.id },
        data: args.dto,
    });
}

export default changeProfileResolver;
