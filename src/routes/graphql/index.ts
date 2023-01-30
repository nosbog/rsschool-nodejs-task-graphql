import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { createYoga } from 'graphql-yoga';
import { graphqlBodySchema, schema } from './schema';

const yoga = createYoga({ schema });

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
    async function (request, reply) {
      const response = await yoga.handleNodeRequest(request, {
        request,
        reply,
        db: this.db,
      });
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      reply.status(response.status);

      reply.send(response.body);

      return reply;
    }
  );
};

export default plugin;
