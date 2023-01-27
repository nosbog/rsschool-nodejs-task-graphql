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
      const { id } = request.params;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) {
        return user;
      } else {
        throw reply.notFound('User not found');
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
    async function (request, reply): Promise<UserEntity> {
      const newUser = request.body;
      return await fastify.db.users.create(newUser);
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
      const { id } = request.params;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) {
        const allSubscribers = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: id,
        });
        allSubscribers.forEach(async (subscriber) => {
          const newSubscribers = subscriber.subscribedToUserIds.filter(
            (item) => item !== id
          );
          await fastify.db.users.change(subscriber.id, {
            ...subscriber,
            subscribedToUserIds: newSubscribers,
          });
        });
        const profiles = await fastify.db.profiles.findMany({
          key: 'userId',
          equals: user.id,
        });
        profiles.forEach(async (profile) => {
          await fastify.db.profiles.delete(profile.id);
        })
        const posts = await fastify.db.posts.findMany({
          key: 'userId',
          equals: user.id,
        });
        posts.forEach(async (post) => {
          await fastify.db.posts.delete(post.id);
        })
        return await fastify.db.users.delete(id);
      } else {
        throw fastify.httpErrors.badRequest('User not found!');
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
      const { id } = request.params;
      const { userId } = request.body;
      const user1 = await fastify.db.users.findOne({ key: 'id', equals: id });
      const user2 = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });
      if (user1 && user2) {
        user2.subscribedToUserIds.push(id);
        return await fastify.db.users.change(userId, user2);
      } else {
        throw fastify.httpErrors.badRequest('User not found!');
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
      const { id } = request.params;
      const { userId } = request.body;
      const user1 = await fastify.db.users.findOne({ key: 'id', equals: id });
      const user2 = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });
      if (user1 && user2?.subscribedToUserIds.includes(id)) {
        const newSubscribers = user2.subscribedToUserIds.filter(
          (item) => item !== id
        );
        return await fastify.db.users.change(userId, {
          ...user2,
          subscribedToUserIds: newSubscribers,
        });
      } else {
        throw fastify.httpErrors.badRequest('User not found!');
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
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) {
        const newUser = request.body;
        return await fastify.db.users.change(id, newUser);
      } else {
        throw fastify.httpErrors.badRequest('User not found!');
      }
    }
  );
};

export default plugin;
