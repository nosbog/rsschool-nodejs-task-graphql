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
      // const users = await this.db.users.findMany({ key: 'id' });

      return reply.status(200).send();
    }
    catch (error) {
      reply.log.error(error);
      return reply.send(404);
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
        const getUserById = await this.db.users.findOne({ key: 'id', equals: request.params.id });

        if (!getUserById) {
          throw reply.notFound('User id not found')
        }

        return reply.status(200).send(getUserById);
      } catch (error) {
        return reply.send(error)
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
        const createUser = await this.db.users.create(request.body);
        return reply.status(200).send(createUser);
      } catch (error) {
        return reply.send(error);
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
        const deleteUserById = await this.db.users.delete(request.params.id);
        return reply.status(200).send(deleteUserById);
      } catch (error) {
        return reply.send(error);
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
      return reply.send()
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
      return reply.send()
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
        const updateUserById = await this.db.users.change(request.params.id, request.body);
        return reply.status(200).send(updateUserById);
      } catch (error) {
        return reply.send(error);
      }
    }
  );
};

export default plugin;
