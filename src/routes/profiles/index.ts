import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      // @ts-ignore
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id })

      if (!profile) {
        throw fastify.httpErrors.notFound();
      }

      return profile;
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
      // @ts-ignore
      const isProfileExists = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId })
      // @ts-ignore
      const isMemberTypeExists = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId })

      if (isProfileExists || !isMemberTypeExists) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      const profile = await fastify.db.profiles.create(request.body);
      if (!profile) {
        throw fastify.httpErrors.badRequest();
      }

      return profile;
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
      // @ts-ignore
      const profile = await this.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (!profile) {
        throw fastify.httpErrors.badRequest();
      }
      // @ts-ignore
      return await this.db.profiles.delete(request.params.id);
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
      // @ts-ignore
      const profile = await this.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (!profile) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      return await fastify.db.profiles.change(profile.id, request.body);
    }
  );
};

export default plugin;
