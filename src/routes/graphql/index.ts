import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql } from 'graphql';

export let gqlPrisma: any = {};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const {prisma} = fastify;

  gqlPrisma = {prisma}.prisma;
   
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

      const res = await graphql({schema: gqlSchema, source: query}).then((result) => {

        return result
      });

      rep.send(res) ;
    },
  });

};

export default plugin;
