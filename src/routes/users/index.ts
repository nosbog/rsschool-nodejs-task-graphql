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
    return this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      if (request.params.id) {
        const user = await this.db.users.findOne({
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
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return this.db.users.create(request.body);
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
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (user) {
        const removePosts = this.db.posts
          .findMany({
            key: 'userId',
            equals: request.params.id,
          })
          .then((res) => {
            res.forEach((post) => {
              this.db.posts.delete(post.id);
            });
          });
        const removeProfiles = this.db.profiles
          .findMany({
            key: 'userId',
            equals: request.params.id,
          })
          .then((res) => {
            res.forEach((profile) => {
              this.db.profiles.delete(profile.id);
            });
          });

        const removeSubscribers = this.db.users.findMany().then((res) => {
          res.forEach((user) => {
            const subscribers = user.subscribedToUserIds.filter(
              (id) => id !== request.params.id
            );
            this.db.users.change(user.id, {
              ...user,
              subscribedToUserIds: subscribers,
            });
          });
        });

        await Promise.all([removeProfiles, removePosts, removeSubscribers]);

        return this.db.users.delete(request.params.id);
      }
      return reply.code(400).send(null);
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
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      const subscribeToUser = await this.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (user && subscribeToUser) {
        const subscribes = subscribeToUser.subscribedToUserIds.filter(
          (id) => id !== request.params.id
        );
        return this.db.users.change(request.body.userId, {
          subscribedToUserIds: [...subscribes, request.params.id],
        });
      }

      return reply.code(404).send(null);
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
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      const subscribedTo = await this.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (
        subscribedTo &&
        !subscribedTo.subscribedToUserIds.includes(request.params.id)
      ) {
        return reply.code(400).send(null);
      }

      if (user && subscribedTo) {
        const subscribes = subscribedTo.subscribedToUserIds.filter(
          (id) => id !== request.params.id
        );

        return this.db.users.change(request.body.userId, {
          subscribedToUserIds: subscribes,
        });
      }

      return reply.code(404).send(null);
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
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (user) {
        return this.db.users.change(request.params.id, {
          ...request.body,
        });
      }

      return reply.code(400).send(null);
    }
  );
};

export default plugin;
