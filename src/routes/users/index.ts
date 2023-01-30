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
  fastify.get('/', async function(request, reply): Promise<UserEntity[]> {
    try {
      const users = await this.db.users.findMany();
      return reply.send(users);
    } catch (e) {
      return reply.code(404).send(e);
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function(request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const user = await this.db.users.findOne({ key: "id", equals: id });
        if (!user) {
          return reply.code(404);
        }
        return reply.send(user);
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<UserEntity> {
      try {
        const body = request.body;
        if (!body) {
          return reply.code(400);
        }
        const createdUser = await this.db.users.create(body);
        if (!createdUser) {
          return reply.code(404);
        }
        return reply.send(createdUser);
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const deletedUser = await this.db.users.delete(id);
        if (!deletedUser) {
          return reply.code(404);
        } else {
          return reply.send(deletedUser);
        }
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params;
        const body = request.body;
        if (!id) {
          return reply.code(400);
        }
        if (!body) {
          return reply.code(400);
        }
        const user = await this.db.users.findOne({ key: "id", equals: id });
        if (!user) {
          return reply.code(404)
        }
        const updatedSubscribedToUserIds = [...user.subscribedToUserIds, body.userId]
        const subscribedUser = await this.db.users.change(id, { subscribedToUserIds: updatedSubscribedToUserIds });
        return reply.send(subscribedUser)
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params
        const body = request.body
        if (!id) {
          return reply.code(400);
        }
        if (!body) {
          return reply.code(400);
        }
        const user = await this.db.users.findOne({ key: "id", equals: id })
        if (!user) {
          return reply.code(404)
        }
        const updatedUserSubscriptions = user.subscribedToUserIds.filter(id => id !== body.userId)
        const updatedUserWithSubscriptions = await this.db.users.change(id, { subscribedToUserIds: updatedUserSubscriptions })
        return reply.send(updatedUserWithSubscriptions)
      } catch (e) {
        return reply.code(500).send(e)
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
    async function(request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params
        const body = request.body
        if (!id) {
          return reply.code(400);
        }
        if (!body) {
          return reply.code(400);
        }
        const updatedUser = await this.db.users.change(id, body)
        if (!updatedUser) {
          return reply.code(404)
        }
        return reply.send(updatedUser)
      } catch (e) {
        return reply.code(500).send(e)
      }
    }
  );
};

export default plugin;
