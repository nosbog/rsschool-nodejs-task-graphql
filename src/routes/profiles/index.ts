import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    try {
      return await this.db.profiles.findMany();
    } catch (error) {
      reply.statusCode = 404;
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
    async function (request, reply): Promise<ProfileEntity | null> {
      try {
        return await this.db.profiles.findOne({ key: 'id', equals: request.params.id });
      } catch (error) {
        reply.statusCode = 404;
        throw reply.notFound();
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const { avatar, sex, birthday, country, street, city, userId, memberTypeId } = request.body;
        return await this.db.profiles.create({
          avatar, sex, birthday, country, street, city, userId, memberTypeId
        });
      } catch (error) {
        reply.statusCode = 400;
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
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return this.db.profiles.delete(request.params.id);
      } catch (error) {
        reply.statusCode = 400;
        throw reply.badRequest();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return this.db.profiles.change(request.params.id, request.body);
      } catch (error) {
        reply.statusCode = 400;
        throw reply.badRequest();
      }
    }
  );
};

export default plugin;
