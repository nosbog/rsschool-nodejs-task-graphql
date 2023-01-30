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
      return this.db.users.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const user = await this.db.users.findOne({key: "id", equals: request.params.id})
        if(!user){
            reply.code(404)
            throw new Error('User not found')
        }
        return user
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
        return this.db.users.create(request.body)
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
        const userId = request.params.id

        const subscribedUsers = await this.db.users.findMany({ key: 'subscribedToUserIds', inArray: userId })
        for (const user of subscribedUsers) {
            const changedUser = {
                ...user,
                subscribedToUserIds: user.subscribedToUserIds.filter(value => value !== userId)
            }
            this.db.users.change(user.id, changedUser)
        }
        return this.db.users.delete(userId)
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
        const subscribeToUser = await this.db.users.findOne({ key: 'id', equals: request.params.id })
        const subscriber = await this.db.users.findOne({ key: 'id', equals: request.body.userId })
        if (!subscribeToUser || !subscriber) {
            reply.code(404)
            throw new Error('User not found')
        }
        subscriber.subscribedToUserIds = Array.from(new Set([...subscriber.subscribedToUserIds, request.params.id]))

        return this.db.users.change(subscriber.id, subscriber)
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
        const unsubscribeUser = await this.db.users.findOne({key: 'id', equals: request.params.id})
        const unsubscribeFrom = await this.db.users.findOne({ key: 'id', equals: request.body.userId })

        if (!unsubscribeUser || !unsubscribeFrom) {
            reply.code(404)
            throw new Error('User not found')
        }

        if (!unsubscribeFrom.subscribedToUserIds.includes(unsubscribeUser.id)) {
            reply.code(400)
            throw new Error('User already unsubscribed')
        }

        unsubscribeFrom.subscribedToUserIds = unsubscribeFrom.subscribedToUserIds.filter(value =>
            value !== unsubscribeUser.id)

        return this.db.users.change(unsubscribeFrom.id, unsubscribeFrom)
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
        return this.db.users.change(request.params.id, request.body)
    }
  );
};

export default plugin;
