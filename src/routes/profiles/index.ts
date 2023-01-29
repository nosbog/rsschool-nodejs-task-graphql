import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const profile: ProfileEntity | null = await fastify.db.profiles.findOne({key: "id", equals: request.params.id});
      if (!profile) {
        reply.statusCode = 404;
        throw new Error("Profile not found");
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
      const profile: ProfileEntity | null = await fastify.db.profiles.findOne({key: "userId", equals: request.body.userId});
      if(profile) {
        reply.statusCode = 400;
        throw new Error("User already has a profile");
      }
      const memberTypeId = await fastify.db.memberTypes.findOne({key: "id", equals: request.body.memberTypeId});
      if(!memberTypeId) {
        reply.statusCode = 400;
        throw new Error("memberTypeId not found");
      }
      return fastify.db.profiles.create(request.body);
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const profile: ProfileEntity | null = await fastify.db.profiles.findOne({key: "id", equals: request.params.id});
      if (!profile) {
        reply.statusCode = 400;
        throw new Error("Profile not found");
      }
      return fastify.db.profiles.delete(request.params.id);
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
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Id is invalid");
      }
      const profile: ProfileEntity | null = await fastify.db.profiles.findOne({key: "id", equals: request.params.id});
      if (!profile) {
        reply.statusCode = 400;
        throw new Error("Profile not found");
      }
      if(request.body.avatar) profile.avatar = request.body.avatar;
      if(request.body.birthday) profile.birthday = request.body.birthday;
      if(request.body.city) profile.city = request.body.city;
      if(request.body.country) profile.country = request.body.country;
      if(request.body.memberTypeId) profile.memberTypeId = request.body.memberTypeId;
      if(request.body.sex) profile.sex = request.body.sex;
      if(request.body.street) profile.street = request.body.street;
      return fastify.db.profiles.change(request.params.id, profile);
    }
  );
};

export default plugin;
