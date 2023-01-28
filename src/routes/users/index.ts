import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!user) {
        reply.statusCode = 404;
        throw new Error('User not found!');
      } else {
        return user;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request): Promise<UserEntity> {
      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!user) {
        throw new Error('User not found!');
      } else {
        return await fastify.db.users.delete(request.params.id);
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });
      if (!user) {
        reply.statusCode = 404;
        throw new Error('User not found!');
      } else {
        const subscribedToUserIds = [...user.subscribedToUserIds, request.body.userId];
        const updatedUser = await fastify.db.users.change(id, {
          subscribedToUserIds,
        });
        return updatedUser;
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });
      if (!user) {
        reply.statusCode = 404;
        throw new Error('User not found!');
      } else {
        const subscribedToUserIds = user.subscribedToUserIds.filter(el => request.body.userId !== el ) ;
        const updatedUser = await fastify.db.users.change(id, {
          subscribedToUserIds,
        });
        return updatedUser;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const id = request.params.id;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (!user) {
        throw new Error('User not found!');
      } else {
        const updatedUser = await fastify.db.users.change(id, request.body);
        return updatedUser;
      }
    }
  );
};

export default plugin;
