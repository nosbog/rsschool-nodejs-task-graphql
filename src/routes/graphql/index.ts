import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql/graphql';

import { graphqlBodySchema } from './schema';
import { getRequestSchema } from './requestSchema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async (request) => graphql(
      {
        schema: getRequestSchema(fastify),
        source: request.body.query as string,
      },
    ),
  );
};

export default plugin;
