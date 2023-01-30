import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<
    MemberTypeEntity[]
  > {
    return await fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!memberType) {
        throw fastify.httpErrors.notFound();
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
    async function (request): Promise<MemberTypeEntity> {
      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!memberType) {
        throw fastify.httpErrors.badRequest();
      }

      return await fastify.db.memberTypes.change(memberType.id, request.body);
    }
  );
};

export default plugin;
