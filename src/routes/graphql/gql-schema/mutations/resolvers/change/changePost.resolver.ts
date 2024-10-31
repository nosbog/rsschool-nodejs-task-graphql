import { PrismaClient } from '@prisma/client';

async function changePostResolver(args: Record<string, any>, prisma: PrismaClient) {
    return await prisma.post.update({
        where: { id: args.id },
        data: args.dto,
    });
}

export default changePostResolver;
