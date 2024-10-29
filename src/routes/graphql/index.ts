import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { buildSchema, graphql } from 'graphql';
import typeDefs from './gql-types/schema.graphql.js';
import { FastifyRequest, FastifyReply } from 'fastify';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  const schema = buildSchema(
    typeDefs,
    {}
  );

  const root = {
    //Query: {
      memberTypes: async () => {
        return await prisma.memberType.findMany();
      },
      posts: async () => {
        return await prisma.post.findMany();
      },
      users: async () => {
        return await prisma.user.findMany();
      },
      profiles: async () => {
        return await prisma.profile.findMany();
      },
      memberType: async (id) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id },
        });
        if (memberType === null) {
          throw httpErrors.notFound();
        }
        return memberType;
      },
      post: async (id) => {
        const post = await prisma.post.findUnique({
          where: { id },
        });
        if (post === null) {
          throw httpErrors.notFound();
        }
        return post;
      },
      user: async (id) => {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (user === null) {
          throw httpErrors.notFound();
        }
        return user;
      },
      profile: async (id) => {
        const profile = await prisma.profile.findUnique({
          where: { id },
        });
        if (profile === null) {
          throw httpErrors.notFound();
        }
        return profile;
      },
    //},
    //Mutations: {
      createPost: async (req) => {
        return await prisma.post.create({
          data: req.body,
        });
      },
      createUser: async (req) => {
        return await prisma.user.create({
          data: req.body,
        });
      },
      createProfile: async (req) => {
        return await prisma.profile.create({
          data: req.body,
        });
      },
      deleteUser: async (req) => {
        return await prisma.user.delete({
          where: {
            id: req.params.userId,
          },
        });
      },
    //},
  };

  // routing
  //await gql_loader_prime(fastify, schema, root);

  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Methods', 'GET,POST');
      reply.header('Access-Control-Allow-Headers', '*');
      const source = (request.query as any)?.query as string;
      const response = await graphql({
          schema,
          source,
          rootValue: root,
      });
      reply.send(response);
    },
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const source = (request.query as any)?.query as string;
      const response = await graphql({
          schema,
          source,
          rootValue: root,
      });
      reply.send(response);
    },
  });
};

// http://localhost:8000/graphql?query={memberTypes{id discount postsLimitPerMonth}}
// http://localhost:8000/graphql?query={memberTypes{id discount postsLimitPerMonth} posts{id title content} users{id name balance} profiles{id isMale yearOfBirth}}
// http://localhost:8000/graphql?query={($userId:4b7dd438-89c2-452e-a5fa-a597d9813ded,$profileId:5e1f7616-e7ac-43f6-96a7-7bb1ba5095ba,$memberTypeId:BASIC,$postId:9ae27896-c05e-4ea2-943e-88245f0c3141){memberType(id: $memberTypeId){id discount postsLimitPerMonth} post(id: $postId){id title content} user(id: $userId){id name balance} profile(id: $profileId){id isMale yearOfBirth}}}
// http://localhost:8000/graphql?query={($userId:4b7dd438-89c2-452e-a5fa-a597d9813ded){user(id: $userId){id name balance}}}

export default plugin;
