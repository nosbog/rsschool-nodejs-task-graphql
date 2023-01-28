import { UserEntity } from './../../utils/DB/entities/DBUsers';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!user) {
        throw reply.notFound(`User ${user} not found!`);
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
      return await this.db.users.create(request.body);
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
      try {
        const userId = request.params.id;
        const userProfile = await this.db.profiles.findOne({ key: 'userId', equals: userId });
        const userPosts = await this.db.posts.findMany({ key: 'userId', equals: userId });
        const subscribers = await this.db.users.findMany({ key: 'subscribedToUserIds', inArray: userId });

        subscribers.forEach(async (user) => {
          const userIndex = user.subscribedToUserIds.indexOf(userId);
          user.subscribedToUserIds.splice(userIndex, 1);

          await this.db.users.change(user.id, {
            subscribedToUserIds: user.subscribedToUserIds
          });
        });

        userPosts.forEach(async (post) => {
          await this.db.posts.delete(post.id);
        });

        if (userProfile) {
          await this.db.profiles.delete(userProfile.id);
        }

        return await this.db.users.delete(request.params.id);
      } catch (error: any) {
        throw reply.badRequest(error.message);
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
      const userId = request.params.id;
      const subscribedUserId = request.body.userId;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });

      if (!user) {
        throw reply.notFound(`User ${user} not found!`);
      } else {
        const subscribedUser = await this.db.users.findOne({ key: 'id', equals: subscribedUserId });

        if (!subscribedUser) {
          throw reply.badRequest(`User ${subscribedUser} not found!`);
        } else {
          if (subscribedUser.subscribedToUserIds.includes(userId)) {
            throw reply.badRequest(`User ${subscribedUser} already subscribed!`);
          } else {
            return await this.db.users.change(subscribedUserId, {
              subscribedToUserIds: [...subscribedUser.subscribedToUserIds, userId]
            });
          }
        }
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
      const userId = request.params.id;
      const subscribedUserId = request.body.userId;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });

      if (!user) {
        throw reply.notFound(`User ${user} not found!`);
      } else {
        const subscribedUser = await this.db.users.findOne({ key: 'id', equals: subscribedUserId });

        if (!subscribedUser) {
          throw reply.badRequest(`User ${subscribedUser} not found!`);
        } else {
          const userIndex = subscribedUser.subscribedToUserIds.indexOf(userId);

          if (userIndex < 0) {
            throw reply.badRequest(`User ${subscribedUser} not subscribed`);
          } else {
            subscribedUser.subscribedToUserIds.splice(userIndex, 1);

            return await this.db.users.change(subscribedUserId, {
              subscribedToUserIds: subscribedUser.subscribedToUserIds
            });
          }
        }
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
      try {
        return await this.db.users.change(request.params.id, request.body);
      } catch (error: any) {
        throw reply.badRequest(error.message);
      }
    }
  );
};

export default plugin;
