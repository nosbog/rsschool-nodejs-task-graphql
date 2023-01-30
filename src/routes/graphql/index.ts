import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import {
  graphql,
} from 'graphql';
import { schemas } from './schemas';
import { graphqlBodySchema } from './schema';
import { GraphQLError } from 'graphql/error';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function(request, reply) {
      try {
        return await graphql({
          schema: schemas,
          source: String(request.body.query),
          contextValue: fastify,
          variableValues:request.body.variables,
        });
      } catch (error:any) {
        return new GraphQLError(error.message)
      }
    }
  );
};

export default plugin;
