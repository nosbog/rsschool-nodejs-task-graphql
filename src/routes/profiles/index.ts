import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function(request, reply): Promise<ProfileEntity[]> {
    try {
      const profiles = await this.db.profiles.findMany();
      if (!profiles) {
        return reply.code(404);
      }
      return reply.send(profiles);
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
    async function(request, reply): Promise<ProfileEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const profile = await this.db.profiles.findOne({
          key: 'id',
          equals: id,
        });
        if (!profile) {
          return reply.code(404);
        }
        return reply.send(profile);
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<ProfileEntity> {
      try {
        const body = request.body;
        if (!body) {
          return reply.code(400);
        }
        const createdProfile = await this.db.profiles.create(body);
        if (!createdProfile) {
          return reply.code(404);
        }
        return reply.send(createdProfile);
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
    async function(request, reply): Promise<ProfileEntity> {
      try {
        const { id } = request.params;
        if (!id) {
          return reply.code(400);
        }
        const deletedProfile = await this.db.profiles.delete(id);
        if (!deletedProfile) {
          return reply.code(404);
        }
        return reply.send(deletedProfile);
      } catch (e) {
        return reply.code(500).send(e);
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
    async function(request, reply): Promise<ProfileEntity> {
      try {
        const { id } = request.params;
        const body = request.body;
        if (!id) {
          return reply.code(400);
        }
        if (!body) {
          return reply.code(400);
        }
        const updatedProfile = await this.db.profiles.change(id, body);
        if (!updatedProfile) {
          return reply.code(404);
        }
        return reply.send(updatedProfile);
      } catch (e) {
        return reply.code(500).send(e);
      }
    }
  );
};

export default plugin;
