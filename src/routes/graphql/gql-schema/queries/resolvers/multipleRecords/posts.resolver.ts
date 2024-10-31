import { PrismaClient, Post } from '@prisma/client';

async function postsResolver(prisma: PrismaClient): Promise<Post[]> {
    return await prisma.post.findMany();
}

export default postsResolver;
