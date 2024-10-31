import { PrismaClient } from '@prisma/client';

async function deleteUserResolver(args: Record<string, any>, prisma: PrismaClient) {
    return Boolean(await prisma.user.delete({ where: { id: args.id } }));
}

export default deleteUserResolver;
