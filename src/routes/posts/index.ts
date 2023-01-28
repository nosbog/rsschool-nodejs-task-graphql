import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return await fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!post) {
        throw fastify.httpErrors.notFound(
          `Post with id : ${request.params.id} not found`
        );
      }

      return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const isUserExist = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      if (!!isUserExist) {
        return await fastify.db.posts.create(request.body);
      }
      throw fastify.httpErrors.notFound('User not found');
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await fastify.db.posts.delete(request.params.id);
      } catch (error: unknown) {
        if (error instanceof Error)
          throw fastify.httpErrors.badRequest(error.message);

        if (typeof error === 'string')
          throw fastify.httpErrors.badRequest(error);

        throw fastify.httpErrors.badRequest('Bad request');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await fastify.db.posts.change(request.params.id, request.body);
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
