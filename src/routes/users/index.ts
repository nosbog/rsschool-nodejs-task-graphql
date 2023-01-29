import {FastifyPluginAsyncJsonSchemaToTs} from '@fastify/type-provider-json-schema-to-ts';
import {idParamSchema} from '../../utils/reusedSchemas';
import {changeUserBodySchema, createUserBodySchema, subscribeBodySchema,} from './schemas';
import type {UserEntity} from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      // @ts-ignore
      const user = await this.db.users.findOne({ key: 'id', equals: request.params.id });

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
    async function (request, reply): Promise<UserEntity> {
      // @ts-ignore
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
    async function (request, reply): Promise<UserEntity> {
      // @ts-ignore
      const user = await this.db.users.findOne({ key: 'id', equals: request.params.id });
      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      const profile = await this.db.profiles.findOne({ key: 'userId', equals: user.id });
      if (profile) {
        await this.db.profiles.delete(profile.id)
      }

      const post = await this.db.posts.findOne({ key: 'userId', equals: user.id });
      if (post) {
        await this.db.posts.delete(post.id)
      }

      // @ts-ignore
      const subscribers = await this.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id });
      for (const subscriber of subscribers) {
        await this.db.users.change(subscriber.id, {
          // @ts-ignore
          subscribedToUserIds: subscriber.subscribedToUserIds.filter((id) => id !== request.params.id),
        });
      }

      // @ts-ignore
      return await this.db.users.delete(request.params.id);
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
      // @ts-ignore
      const user = await this.db.users.findOne({ key: 'id', equals: request.body.userId });
      // @ts-ignore
      const userToSubscribe = await this.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!user || !userToSubscribe) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      return await this.db.users.change(request.body.userId, {
        // @ts-ignore
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
    async function (request, reply): Promise<UserEntity> {
      // @ts-ignore
      const user = await this.db.users.findOne({ key: 'id', equals: request.body.userId });
      // @ts-ignore
      const userToUnsubscribe = await this.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      if (!userToUnsubscribe) {
        throw fastify.httpErrors.badRequest();
      }

      const isUserSubscribed = user.subscribedToUserIds.includes(userToUnsubscribe.id);
      if (!isUserSubscribed) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      return await fastify.db.users.change(request.body.userId, {
        // @ts-ignore
        subscribedToUserIds: user.subscribedToUserIds.filter(id => id !== request.params.id)
      })
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
    async function (request, reply): Promise<UserEntity> {
      // @ts-ignore
      const user = await this.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      return await fastify.db.users.change(user.id, request.body);
    }
  );
};

export default plugin;
