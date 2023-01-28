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
        throw fastify.httpErrors.notFound(
          `User with id : ${request.params.id} not found`
        );
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
    async function (request, reply): Promise<UserEntity> {
      try {
        return fastify.db.users.delete(request.params.id);
      } catch (error: unknown) {
        if (error instanceof Error)
          throw fastify.httpErrors.badRequest(error.message);

        if (typeof error === 'string')
          throw fastify.httpErrors.badRequest(error);

        throw fastify.httpErrors.badRequest('Bad request');
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
      const currentUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      const userToSubscribeFor = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (currentUser === null || userToSubscribeFor === null) {
        throw fastify.httpErrors.badRequest('User not found');
      }

      const userAlreadySubscribed = currentUser.subscribedToUserIds.includes(
        request.params.id
      );

      if (userAlreadySubscribed) {
        return currentUser;
      }

      const userTriesToSubscribeToHimself =
        request.body.userId === request.params.id;

      if (userTriesToSubscribeToHimself) {
        throw fastify.httpErrors.badRequest("You can't subscribe to yourself");
      }

      try {
        const patchedUser = await fastify.db.users.change(request.body.userId, {
          subscribedToUserIds: [
            ...currentUser.subscribedToUserIds,
            request.params.id,
          ],
        });

        return patchedUser;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
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
      const currentUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      const userToUnsubscribeFrom = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (currentUser === null || userToUnsubscribeFrom === null) {
        throw fastify.httpErrors.badRequest('User not found');
      }

      const userSubscribedToAnotherUser =
        currentUser.subscribedToUserIds.includes(request.params.id);

      if (!userSubscribedToAnotherUser) {
        throw fastify.httpErrors.badRequest('You are not following this user');
      }

      const userTriesToUnsubscribeFromHimself =
        request.body.userId === request.params.id;

      if (userTriesToUnsubscribeFromHimself) {
        throw fastify.httpErrors.badRequest(
          "You can't unsubscribe from yourself"
        );
      }

      try {
        const subscribedUserIndex = currentUser.subscribedToUserIds.indexOf(
          request.params.id
        );

        currentUser.subscribedToUserIds.splice(subscribedUserIndex, 1);

        const patchedUser = await fastify.db.users.change(request.body.userId, {
          subscribedToUserIds: currentUser.subscribedToUserIds,
        });

        return patchedUser;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
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
        return await fastify.db.users.change(request.params.id, request.body);
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
