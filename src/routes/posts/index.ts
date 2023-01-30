import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function(request, reply): Promise<PostEntity[]> {
    try {
      const posts = await this.db.posts.findMany();
      if (!posts) {
        return reply.code(404);
      }
      return reply.send(posts);
    } catch (e) {
      return reply.code(500).send(e);
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function(request, reply): Promise<PostEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const post = await this.db.posts.findOne({ key: 'id', equals: id });
        if (!post) {
          return reply.code(404);
        }
        return reply.send(post);
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<PostEntity> {
      try {
        const body = request.body;
        if (!body) {
          return reply.code(400);
        }
        const createdPost = await this.db.posts.create(body);
        if (!createdPost) {
          return reply.code(404);
        }
        return reply.send(createdPost);
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
    async function(request, reply): Promise<PostEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const deletedPost = await this.db.posts.delete(id);
        if (!deletedPost) {
          return reply.code(404);
        }
        return reply.send(deletedPost);
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<PostEntity> {
      try {
        const { id } = request.params;
        const body = request.body;
        if (!id) {
          return reply.code(400);
        }
        if (!body) {
          return reply.code(400);
        }
        const updatedPost = await this.db.posts.change(id, body);
        if (!updatedPost) {
          return reply.code(404);
        }
        return reply.send(updatedPost);
      } catch (e) {
        return reply.code(500).send(e);
      }
    }
  );
};

export default plugin;
