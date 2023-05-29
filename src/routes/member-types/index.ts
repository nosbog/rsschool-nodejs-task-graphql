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
    const memberTypes = await this.db.memberTypes.findMany();
    return memberTypes;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | void> {
      const memeberType = await this.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!memeberType) {
        reply.notFound();
      } else {
        return memeberType;
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
    async function (request, reply): Promise<MemberTypeEntity | void> {
      try {
        const memeberType = await this.db.memberTypes.change(
          request.params.id,
          request.body
        );
        if (!memeberType) {
          reply.badRequest();
        } else {
          return memeberType;
        }
      } catch (err) {
        reply.badRequest();
      }
    }
  );
};

export default plugin;
