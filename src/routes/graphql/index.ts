import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, buildSchema } from 'graphql';
//import { createGraphSQLSchema } from './gql-types/root.js';
import typeDefs from './gql-types/schema.graphql.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const schema = buildSchema(
    typeDefs,
    {}
  );
  const root = {
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
    }
  };
  
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request, reply) {
      // return graphql();
      const response = await graphql({
        schema,
        source: `mutation ($userDto: CreateUserInput!) {
          createUser(dto: $userDto) {
              id
          }
        }`,
        rootValue: root,
      });
      console.log('!!!!!', await prisma.user.findMany())
      reply.send(response);
    },
  });

  fastify.route({
    url: '/:userId',
    method: 'DELETE',
    schema: {
      ...createGqlResponseSchema,
      response: {
        204: gqlResponseSchema,
      },
    },
    async handler(request, reply) {
      const response = await graphql({
        schema,
        source: `mutation ($userId: UUID!) {
          deleteUser(id: $userId)
        }`,
        rootValue: root,
      });
      console.log('!!!!!', await prisma.user.findMany())
      reply.send(response);
    },
  });
};

export default plugin;
