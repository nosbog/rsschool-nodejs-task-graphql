import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (request.params.id) {
        const user = await this.db.profiles.findOne({
          key: 'id',
          equals: request.params.id,
        });

        if (user) {
          return user;
        }
      }

      return reply.code(404).send(null);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      const memberType = await this.db.memberTypes.findOne({
        key: 'id',
        equals: request.body.memberTypeId,
      });
      if (!user || !memberType) {
        return reply.code(400).send(null);
      }
      const profile = await this.db.profiles.findOne({
        key: 'userId',
        equals: request.body.userId,
      });
      if (profile) {
        return reply.code(400).send(null);
      }
      return this.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (profile) {
        return this.db.profiles.delete(request.params.id);
      }
      return reply.code(400).send(null);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (profile) {
        return this.db.profiles.change(request.params.id, {
          ...request.body,
        });
      }
      return reply.code(400).send(null);
    }
  );
};

export default plugin;
