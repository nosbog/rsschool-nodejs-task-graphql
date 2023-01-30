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
    return this.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      if (request.params.id) {
        const memberType = await this.db.memberTypes.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (memberType) {
          return memberType;
        } else {
          return reply.code(404).send(null);
        }
      }
      return reply.code(400).send(null);
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
      const memberType = await this.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (memberType) {
        return this.db.memberTypes.change(request.params.id, {
          ...request.body,
        });
      }

      return reply.code(400).send(null);
    }
  );
};

export default plugin;
