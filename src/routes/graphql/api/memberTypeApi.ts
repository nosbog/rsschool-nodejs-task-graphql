import { FastifyInstance } from 'fastify';
import { MemberTypeId } from '../../member-types/schemas.js';

export const getAllMemberTypes = async (fastify: FastifyInstance) => {
  const memberTypes = await fastify.prisma.memberType.findMany();
  return memberTypes;
};

export const getMemberType = async (id: MemberTypeId, fastify: FastifyInstance) => {
  const memberType = await fastify.prisma.memberType.findFirst({
    where: {
      id: id,
    },
  });
  return memberType;
};
