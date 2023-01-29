import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const posts: PostEntity | null = await fastify.db.posts.findOne({key: "id", equals: request.params.id});
      if (!posts) {
        reply.statusCode = 404;
        throw new Error("Post not found");
      }
      return posts;
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
      const posts: PostEntity | null = await fastify.db.posts.findOne({key: "id", equals: request.body.userId});
      if (posts) {
        reply.statusCode = 400;
        throw new Error("user already has a profile");
      }
      return fastify.db.posts.create(request.body);
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const posts: PostEntity | null = await fastify.db.posts.findOne({key: "id", equals: request.params.id});
      if (!posts) {
        reply.statusCode = 400;
        throw new Error("Post not found");
      }
      return fastify.db.posts.delete(request.params.id);
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const posts: PostEntity | null = await fastify.db.posts.findOne({key: "id", equals: request.params.id});
      if (!posts) {
        reply.statusCode = 400;
        throw new Error("Post not found");
      }
      return fastify.db.posts.change(request.params.id, request.body);
    }
  );
};

export default plugin;
