import { PrismaClient } from '@prisma/client';

async function deleteProfileResolver(args: Record<string, any>, prisma: PrismaClient) {
    return Boolean(await prisma.profile.delete({ where: { id: args.id } }));
}

export default deleteProfileResolver;
