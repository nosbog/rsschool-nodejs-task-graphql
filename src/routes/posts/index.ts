import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import isUUID from 'validator/lib/isUUID';

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
      // @ts-ignore
      const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id })

      if (!post) {
        throw fastify.httpErrors.notFound();
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
      // @ts-ignore
      const post = await fastify.db.posts.create(request.body);

      if (!post) {
        throw fastify.httpErrors.badRequest();
      }

      return post;
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
      // @ts-ignore
      if (!isUUID(request.params.id)) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      const post = await this.db.posts.findOne({ key: 'id', equals: request.params.id });

      if (!post) {
        throw fastify.httpErrors.notFound();
      }
      // @ts-ignore
      return await this.db.posts.delete(request.params.id);
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
      // @ts-ignore
      if (!isUUID(request.params.id)) {
        throw fastify.httpErrors.badRequest();
      }

      // @ts-ignore
      const post = await this.db.posts.findOne({ key: 'id', equals: request.params.id });

      if (!post) {
        throw fastify.httpErrors.notFound();
      }

      // @ts-ignore
      return await fastify.db.posts.change(post.id, request.body);
    }
  );
};

export default plugin;
