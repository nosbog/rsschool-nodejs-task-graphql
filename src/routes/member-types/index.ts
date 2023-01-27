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
    try {
      return await this.db.memberTypes.findMany();
    } catch (error) {
      throw reply.notFound();
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        const member = this.db.memberTypes.findOne({ key: 'id', equals: request.params.id });
        return await reply.send(member);
      } catch (error) {
        throw reply.notFound();
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
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        return await this.db.memberTypes.change(request.params.id, request.body);
      } catch (error) {
        throw reply.notFound();
      }
    }
  );
};

export default plugin;
