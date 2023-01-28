import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
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
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw fastify.httpErrors.notFound(
          `Profile with id : ${request.params.id} not found`
        );
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
      const isUserExist = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (!!isUserExist) {
        return await fastify.db.profiles.create(request.body);
      }
      throw fastify.httpErrors.notFound('User not found');
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
      try {
        return await fastify.db.profiles.delete(request.params.id);
      } catch (error: unknown) {
        if (error instanceof Error)
          throw fastify.httpErrors.badRequest(error.message);

        if (typeof error === 'string')
          throw fastify.httpErrors.badRequest(error);

        throw fastify.httpErrors.badRequest('Bad request');
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
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return await fastify.db.profiles.change(
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
