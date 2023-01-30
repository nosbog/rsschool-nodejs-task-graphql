import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function(request, reply): Promise<
    MemberTypeEntity[]
  > {
    try {
      const memberTypes = await this.db.memberTypes.findMany();
      if (!memberTypes) {
        return reply.code(404);
      }
      return reply.send(memberTypes);
    } catch (e) {
      return reply.code(500).send(e);
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function(request, reply): Promise<MemberTypeEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const memberType = await this.db.memberTypes.findOne({
          key: 'id',
          equals: id,
        });
        if (!memberType) {
          return reply.code(404);
        }
        return reply.send(memberType);
      } catch (e) {
        return reply.code(500).send(e);
      }
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
    async function(request, reply): Promise<MemberTypeEntity> {
      try {
        const { id } = request.params;
        const body = request.body;
        if (!id) {
          return reply.code(400);
        }
        if (!body) {
          return reply.code(400);
        }
        const updatedMemberType = await this.db.memberTypes.change(id, body);
        if (!updatedMemberType) {
          return reply.code(404);
        }
        return reply.send(updatedMemberType);
      } catch (e) {
        return reply.code(500).send(e);
      }
    }
  );
};

export default plugin;
