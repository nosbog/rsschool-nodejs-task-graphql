import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql } from 'graphql';
import { PrismaClient } from '@prisma/client';

interface GqlContext {
  prisma?: PrismaClient;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const {prisma} = fastify;

  const gqlContext: GqlContext = {};
  gqlContext.prisma = {prisma}.prisma;
   
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, rep) {

      const query = req.body?.query;

      const res = await graphql({schema: gqlSchema, source: query, contextValue: gqlContext}).then((result) => {

        return result
      });

      rep.send(res) ;
    },
  });

};

export default plugin;
