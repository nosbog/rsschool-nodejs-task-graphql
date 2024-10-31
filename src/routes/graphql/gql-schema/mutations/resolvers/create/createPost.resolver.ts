import { PrismaClient } from '@prisma/client';

async function createPostResolver(args: Record<string, any>, prisma: PrismaClient) {
    return await prisma.post.create({ data: args.dto });
}

export default createPostResolver;
