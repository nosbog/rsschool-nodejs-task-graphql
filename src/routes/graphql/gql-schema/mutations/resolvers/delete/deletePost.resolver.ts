import { PrismaClient } from '@prisma/client';

async function deletePostResolver(args: Record<string, any>, prisma: PrismaClient) {
    return Boolean(await prisma.post.delete({ where: { id: args.id } }));
}

export default deletePostResolver;
