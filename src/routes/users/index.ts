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
    try {
      return await this.db.users.findMany();
    }
    catch (error) {
      throw reply.notFound();
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const getUserById = this.db.users.findOne({ key: 'id', equals: request.params.id });
        return await reply.send(getUserById);
      } catch (error) {
        throw reply.notFound();
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
      try {
        return await this.db.users.create(request.body);
      } catch (error) {
        throw reply.badRequest();
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
    async function (request, reply): Promise<UserEntity> {
      try {
        return await this.db.users.delete(request.params.id);
      } catch (error) {
        throw reply.notFound();
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
      try {
        return await this.db.users.change(request.params.id, {
          'subscribedToUserIds': [request.body.userId]
        });
      } catch (error) {
        throw reply.notFound();
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
      try {
        return await this.db.users.change(request.params.id, {
          'subscribedToUserIds': [request.body.userId]
        });
      } catch (error) {
        throw reply.notFound();
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
      } catch (error) {
        throw reply.notFound();
      }
    }
  );
};

export default plugin;
