import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async (): Promise<UserEntity[]> => fastify.db.users.findMany());

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity> => {
      const user = await fastify.db.users.findOne({
        key: 'id', equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.notFound('Not Found.');
      }

      return user;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async (request): Promise<UserEntity> => {
      try {
        return await fastify.db.users.create(request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request');
      }
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity> => {
      try {
        return await fastify.db.users.delete(request.params.id);
      } catch {
        throw fastify.httpErrors.notFound('Not found.');
      }
    },
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    // @ts-ignore
    async (request, reply): Promise<UserEntity> => {

    },
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    // @ts-ignore
    async (request, reply): Promise<UserEntity> => {},
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    // @ts-ignore
    async (request, reply): Promise<UserEntity> => {},
  );
};

export default plugin;
