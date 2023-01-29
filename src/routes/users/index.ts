import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { indexOf } from 'lodash';

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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const user: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: request.params.id});
      if (user) return user;
      reply.statusCode = 404;
      throw new Error("User not found");
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const user: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: request.params.id});
      if (!user) {
        reply.statusCode = 400;
        throw new Error("User not found");
      }
      const userList = await fastify.db.users.findMany({key: "subscribedToUserIds", inArray: request.params.id}); 
      userList.forEach(async(item) => {
        const user: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: item.id});
        if(user) {
          const pos = indexOf(user.subscribedToUserIds, request.params.id);
          user.subscribedToUserIds.splice(pos, 1);
          await fastify.db.users.change(item.id, user);
        }
      });
      const posts = await fastify.db.posts.findMany({key: "userId", equals: request.params.id});
      posts.forEach(async(item) => {
        await fastify.db.posts.delete(item.id);
      });
      const profile = await fastify.db.profiles.findMany({key: "userId", equals: request.params.id});
      profile.forEach(async(item) => {
        await fastify.db.profiles.delete(item.id);
      });
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const user: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: request.params.id});
      if (!user) {
        reply.statusCode = 404;
        throw new Error("User not found");
      }
      const userDTO: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: request.body.userId});
      if (!userDTO) {
        reply.statusCode = 404;
        throw new Error("User not found");
      }
      userDTO.subscribedToUserIds.push(request.params.id);
      return await fastify.db.users.change(request.body.userId, userDTO);
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const user: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: request.body.userId});
      if (!user) {
        reply.statusCode = 404;
        throw new Error("User not found");
      }
      const pos = indexOf(user.subscribedToUserIds, request.params.id);
      if (pos === -1) {
        reply.statusCode = 400;
        throw new Error("User not found");
      }
      user.subscribedToUserIds.splice(pos, 1);
      return await fastify.db.users.change(request.params.id, user);
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const user: UserEntity | null = await fastify.db.users.findOne({key: "id", equals: request.params.id});
      if (!user) {
        reply.statusCode = 400;
        throw new Error("User not found");
      }
      if(request.body.firstName) user.firstName = request.body.firstName;
      if(request.body.lastName) user.lastName = request.body.lastName;
      if(request.body.email) user.email = request.body.email;
      return fastify.db.users.change(request.params.id, user);
    }
  );
};

export default plugin;
