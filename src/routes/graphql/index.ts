import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { graphql, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit'
import { validate } from "graphql" 

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

      function validationErrors(query: string) {
            const ast = parse(query);
            return validate(graphQLSchema, ast, [depthLimit(5)]);
          }
      const err = validationErrors(query)
      
      if (err.length > 0) {
        return {
          errors: [{
            message: 'exceeds maximum operation depth of 5',
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED'
            }
          }]
        };
      }
      
      const res = await graphql({
        schema: graphQLSchema,
        source: query,
        variableValues: variables,
      }); 
      return err ? res : res
    },
  });
};

export default plugin;
