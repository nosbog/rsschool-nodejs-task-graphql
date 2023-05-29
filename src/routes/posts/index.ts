import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await this.db.posts.findMany();
    return posts;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const post = (await this.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      })) as PostEntity;
      if (!post) {
        reply.notFound();
      } else {
        return post;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      try {
        const post = await this.db.posts.create(request.body);
        return post;
      } catch (err) {
        reply.badRequest();
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
    async function (request, reply): Promise<PostEntity | void> {
      try {
        const post = await this.db.posts.delete(request.params.id);
        return post;
      } catch (err) {
        reply.badRequest();
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
    async function (request, reply): Promise<PostEntity | void> {
      try {
        const post = await this.db.posts.change(
          request.params.id,
          request.body
        );
        return post;
      } catch (err) {
        reply.badRequest();
      }
    }
  );
};

export default plugin;
