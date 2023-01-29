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

      if (!user) throw fastify.httpErrors.notFound();

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
      return await fastify.db.users.create(request.body);
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
      const founded = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!founded) throw fastify.httpErrors.badRequest();

      const posts = await fastify.db.posts.findMany({
        key: 'userId',
        equals: request.params.id,
      });
      await Promise.all(
        posts.map(async (post) => {
          await fastify.db.posts.delete(post.id);
        })
      );

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.params.id,
      });
      profile && (await fastify.db.profiles.delete(profile.id));

      const users = await fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: request.params.id,
      });
      await Promise.all(
        users.map(async (user) => {
          const { id, ...changeDTO } = user;

          const newSubscribedToUserIds = changeDTO.subscribedToUserIds.filter(
            (id) => id !== request.params.id
          );

          return await fastify.db.users.change(user.id, {
            ...changeDTO,
            subscribedToUserIds: newSubscribedToUserIds,
          });
        })
      );

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
    async function (request, reply): Promise<UserEntity> {
      const currentUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!currentUser) throw fastify.httpErrors.badRequest();

      currentUser.subscribedToUserIds.push(request.params.id);

      const { id, ...changeDTO } = currentUser;
      return await fastify.db.users.change(request.body.userId, changeDTO);
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

      if (
        !currentUser ||
        !currentUser.subscribedToUserIds.includes(request.params.id)
      ) {
        throw fastify.httpErrors.badRequest();
      }
      const newSubscribedToUserIds = currentUser.subscribedToUserIds.filter(
        (id) => id !== request.params.id
      );

      const { id, ...changeDTO } = currentUser;
      return await fastify.db.users.change(request.body.userId, {
        ...changeDTO,
        subscribedToUserIds: newSubscribedToUserIds,
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
    async function (request, reply): Promise<UserEntity> {
      try {
        return await fastify.db.users.change(request.params.id, request.body);
      } catch (error: unknown) {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
