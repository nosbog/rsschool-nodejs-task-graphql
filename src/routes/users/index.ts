import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  changeUserBodySchema,
  createUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
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
        throw fastify.httpErrors.notFound();
      }

      return user;
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
      const user = await fastify.db.users.create(request.body);

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      return user;
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
        throw fastify.httpErrors.badRequest();
      }

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: user.id,
      });
      if (profile) {
        await fastify.db.profiles.delete(profile.id);
      }

      const post = await fastify.db.posts.findOne({
        key: 'userId',
        equals: user.id,
      });
      if (post) {
        await fastify.db.posts.delete(post.id);
      }

      const subscribers = await fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: request.params.id,
      });
      for (const subscriber of subscribers) {
        await fastify.db.users.change(subscriber.id, {
          subscribedToUserIds: subscriber.subscribedToUserIds.filter(
            (id) => id !== request.params.id
          ),
        });
      }

      return await fastify.db.users.delete(request.params.id);
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
    async function (request): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      const userToSubscribe = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user || !userToSubscribe) {
        throw fastify.httpErrors.badRequest();
      }

      const isUserSubscribed = user.subscribedToUserIds.includes(
        userToSubscribe.id
      );
      if (isUserSubscribed) {
        throw fastify.httpErrors.badRequest();
      }

      return await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: [...user.subscribedToUserIds, request.params.id],
      });
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
    async function (request): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      const userToUnsubscribe = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      if (!userToUnsubscribe) {
        throw fastify.httpErrors.badRequest();
      }

      const isUserSubscribed = user.subscribedToUserIds.includes(
        userToUnsubscribe.id
      );
      if (!isUserSubscribed) {
        throw fastify.httpErrors.badRequest();
      }

      return await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: user.subscribedToUserIds.filter(
          (id) => id !== request.params.id
        ),
      });
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
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      return await fastify.db.users.change(user.id, request.body);
    }
  );
};

export default plugin;
