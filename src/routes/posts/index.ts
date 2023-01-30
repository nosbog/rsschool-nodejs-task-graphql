import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';


const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return await this.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await this.db.posts.findOne({
          equals: request.params.id,
          key: 'id',
        });

        if (!post) throw this.httpErrors.notFound('Post not found!');

        return post;
      } catch (error) {
        throw this.httpErrors.badRequest();
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
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await this.db.posts.create(request.body);

        return post;
      } catch {
        throw this.httpErrors.badRequest()
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
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await this.db.posts.delete(request.params.id);

        return post;
      } catch {
        throw this.httpErrors.badRequest()
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
      const { id: updatePostId } = request.params;
      const updateProps = request.body;

      try {
        const post = await this.db.posts.findOne({
          key: 'id',
          equals: updatePostId
        });

        if (!post) {
          throw this.httpErrors.notFound('Post nout found');
        }

        const updatedPost = {
          ...post,
          content: updateProps.content ?? post.content,
          title: updateProps.title ?? post.title
        };

        await this.db.posts.change(updatePostId, updatedPost);

        return  updatedPost;
      } catch {
        throw this.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
