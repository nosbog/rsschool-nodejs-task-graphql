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
      reply.statusCode = 404;
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
    async function (request, reply): Promise<MemberTypeEntity | null> {
      try {
        return await this.db.memberTypes.findOne({ key: 'id', equals: request.params.id });
      } catch (error) {
        reply.statusCode = 404;
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
        reply.statusCode = 400;
        throw reply.badRequest();
      }
    }
  );
};

export default plugin;
