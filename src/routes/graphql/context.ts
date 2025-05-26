import { FastifyInstance } from 'fastify';

export interface GraphQLContext {
  prisma: FastifyInstance['prisma'];
}

export function contextFactory(fastify: FastifyInstance): GraphQLContext {
  return {
    prisma: fastify.prisma,
  };
}
