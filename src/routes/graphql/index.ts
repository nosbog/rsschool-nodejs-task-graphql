import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { PrismaClient } from '@prisma/client';

interface GqlContext {
  prisma?: PrismaClient;
  dataloaders?: any;
  userLoaderKey: number;
  postLoaderKey: number;
  profileLoaderKey: number;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const {prisma} = fastify;

  const gqlContext: GqlContext = {
    userLoaderKey: 1,
    postLoaderKey: 2,
    profileLoaderKey: 3
  };
  gqlContext.prisma = {prisma}.prisma;
  gqlContext.dataloaders = new WeakMap();
   
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

      const query = req.body?.query;
      const variables = req.body?.variables;

      const validateErrors = validate(gqlSchema, parse(query), [depthLimit(5)]);
      if (validateErrors && validateErrors.length !== 0) {
        return { data: '', errors: validateErrors };
      }

      console.log('body: ', query, variables)

      const gqlRes = await graphql({schema: gqlSchema, source: query, contextValue: gqlContext, variableValues: variables});
      console.log('gqlRes: ', gqlRes);
      return { data: gqlRes.data, errors: gqlRes.errors };

    },
  });

};

export default plugin;
