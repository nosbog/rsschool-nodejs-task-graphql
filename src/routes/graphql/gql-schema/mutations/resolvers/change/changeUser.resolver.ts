import { PrismaClient } from '@prisma/client';

async function changeUserResolver(args: Record<string, any>, prisma: PrismaClient) {
    return await prisma.user.update({
        where: { id: args.id },
        data: args.dto,
    });
}

export default changeUserResolver;
