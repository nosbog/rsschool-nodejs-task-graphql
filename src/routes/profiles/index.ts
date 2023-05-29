import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    const profiles = await this.db.profiles.findMany();
    return profiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const profile = (await this.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      })) as ProfileEntity;
      if (!profile) {
        reply.notFound();
      } else {
        return profile;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      try {
        const memberType = await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: request.body.memberTypeId,
        });
        const doesProfileExist = await this.db.profiles.findOne({
          key: 'userId',
          equals: request.body.userId,
        });
        const profile = await this.db.profiles.create(request.body);

        if (memberType && !doesProfileExist) {
          return profile;
        } else {
          reply.badRequest();
        }
      } catch (err) {
        reply.badRequest();
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      try {
        const profile = await this.db.profiles.delete(request.params.id);
        return profile;
      } catch (err) {
        reply.badRequest();
      }
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
    async function (request, reply): Promise<ProfileEntity | void> {
      try {
        const profile = await this.db.profiles.change(
          request.params.id,
          request.body
        );
        return profile;
      } catch (err) {
        reply.badRequest();
      }
    }
  );
};

export default plugin;
