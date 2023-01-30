import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return this.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (request.params.id) {
        const post = await this.db.posts.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (post) {
          return post;
        } else {
          return reply.code(404).send(null);
        }
      }
      return reply.code(400).send(null);
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
      // TODO check if user exist
      return this.db.posts.create(request.body);
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
      const post = await this.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (post) {
        return this.db.posts.delete(request.params.id);
      }
      return reply.code(400).send(null);
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
      const post = await this.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (post) {
        return this.db.posts.change(request.params.id, {
          ...request.body,
        });
      } else {
      }

      return reply.code(400).send(null);
    }
  );
};

export default plugin;
