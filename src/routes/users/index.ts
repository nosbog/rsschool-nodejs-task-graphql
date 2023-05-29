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
    const users = await this.db.users.findMany();
    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!user) {
        reply.notFound();
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
    async function (request, reply): Promise<UserEntity | void> {
      try {
        const newUser = await this.db.users.create(request.body);
        return newUser;
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
    async function (request, reply): Promise<UserEntity | void> {
      try {
        const user = (await this.db.users.findOne({
          key: 'id',
          equals: request.params.id,
        })) as UserEntity;

        const subscribers = await this.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: user.id,
        });

        subscribers.forEach((subscriber) => {
          const id = subscriber.subscribedToUserIds.indexOf(user.id);
          if (id > -1) subscriber.subscribedToUserIds.splice(id, 1);
        });

        await Promise.all(
          subscribers.map((subscriber) => {
            return this.db.users.change(subscriber.id, subscriber);
          })
        );

        await fastify.db.users.delete(request.params.id);

        const profile = await this.db.profiles.findOne({
          key: 'userId',
          equals: request.params.id,
        });
        const posts = await fastify.db.posts.findMany({
          key: 'userId',
          equals: request.params.id,
        });

        if (profile) {
          await this.db.profiles.delete(profile.id);
        }
        if (posts) {
          await Promise.all(
            posts.map((post) => {
              return this.db.posts.delete(post.id);
            })
          );
        }

        reply.badRequest();
      } catch (err) {
        reply.badRequest();
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
    async function (request, reply): Promise<UserEntity | void> {
      try {
        const subscribetoUser = (await this.db.users.findOne({
          key: 'id',
          equals: request.body.userId,
        })) as UserEntity;

        const result = await this.db.users.change(request.body.userId, {
          subscribedToUserIds: [
            ...subscribetoUser.subscribedToUserIds,
            request.params.id,
          ],
        });

        return result;
      } catch (err) {
        reply.badRequest();
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
    async function (request, reply): Promise<UserEntity | void> {
      try {
        const unsubscribeFromUser = (await this.db.users.findOne({
          key: 'id',
          equals: request.body.userId,
        })) as UserEntity;

        const doesUserFollow = unsubscribeFromUser.subscribedToUserIds.includes(
          request.params.id
        );

        if (!doesUserFollow) {
          reply.badRequest();
        } else {
          const newSubscribers = unsubscribeFromUser.subscribedToUserIds.filter(
            (sub) => sub !== request.params.id
          );

          const result = await this.db.users.change(request.body.userId, {
            subscribedToUserIds: newSubscribers,
          });

          return result;
        }
      } catch (err) {
        reply.badRequest();
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
    async function (request, reply): Promise<UserEntity | void> {
      try {
        const user = await this.db.users.change(
          request.params.id,
          request.body
        );
        return user;
      } catch (err) {
        reply.badRequest();
      }
    }
  );
};

export default plugin;
