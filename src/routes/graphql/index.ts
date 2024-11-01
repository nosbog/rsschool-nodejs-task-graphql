import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import {queryRootType} from "./query/root.js";

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

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
      const schema = new GraphQLSchema({
        query: queryRootType,
        //mutation: {}
      });
      const source = req.body.query
      const variableValues = req.body.variables;
      const contextValue = { prisma };

      const errorsValidation = validate(schema, parse(source), [depthLimit(DEPTH_LIMIT)]);

      if (errorsValidation.length) {
        return {
          errors: errorsValidation
        };
      }

      return await graphql({
        schema,
        source,
        variableValues,
        contextValue,
      });
    },
  });


};

export default plugin;
