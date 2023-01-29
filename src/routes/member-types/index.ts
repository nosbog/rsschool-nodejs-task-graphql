import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const memberType: MemberTypeEntity | null = await fastify.db.memberTypes.findOne({key: "id", equals: request.params.id});
      if (!memberType) {
        reply.statusCode = 404;
        throw new Error("Post not found");
      }
      return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const memberType: MemberTypeEntity | null = await fastify.db.memberTypes.findOne({key: "id", equals: request.params.id});
      if (!memberType) {
        reply.statusCode = 400;
        throw new Error("Post not found");
      }
      return fastify.db.memberTypes.change(request.params.id, request.body);
    }
  );
};

export default plugin;
