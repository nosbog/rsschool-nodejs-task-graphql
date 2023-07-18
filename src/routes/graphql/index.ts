import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      // const documentNode = parse(query)
      // const result = await execute({
      //   schema: graphQLSchema,
      //   document: documentNode,
      //   variableValues: variables
      // })
      const res = await graphql({
        schema: graphQLSchema,
        source: query,
        variableValues: variables
      })
      console.log(res)
      // const result = await fastify.prisma.user.findMany()
      return res
    },
  });
};

export default plugin;
