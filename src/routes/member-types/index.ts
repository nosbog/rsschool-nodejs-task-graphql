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
      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!memberType) {
        throw fastify.httpErrors.notFound(
          `Member type with id : ${request.params.id} not found`
        );
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
      try {
        return await fastify.db.memberTypes.change(
          request.params.id,
          request.body
        );
      } catch (error: unknown) {
        if (error instanceof Error)
          throw fastify.httpErrors.badRequest(error.message);

        if (typeof error === 'string')
          throw fastify.httpErrors.badRequest(error);

        throw fastify.httpErrors.badRequest('Bad request');
      }
    }
  );
};

export default plugin;
