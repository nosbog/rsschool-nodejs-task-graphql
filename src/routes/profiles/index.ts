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
    return await this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | null> {
      const profile = await this.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (!profile) {
        throw reply.notFound(`Profile ${profile} not found!`);
      }

      return profile;
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
      const profile = await this.db.profiles.findOne({ key: 'userId', equals: request.body.userId });
      const memberTypeId = await this.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });

      if (profile) {
        throw reply.badRequest(`Profile ${profile} already exist!`);
      }

      if (!memberTypeId) {
        throw reply.badRequest(`Member Type ${memberTypeId} doesn't exist!`);
      }

      return await this.db.profiles.create(request.body);
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
        return await this.db.profiles.delete(request.params.id);
      } catch (error: any) {
        throw reply.badRequest(error.message);
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
        return await this.db.profiles.change(request.params.id, request.body);
      } catch (error: any) {
        throw reply.badRequest(error.message);
      }
    }
  );
};

export default plugin;
