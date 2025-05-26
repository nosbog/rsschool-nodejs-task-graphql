import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const opts: Partial<AutoloadPluginOptions> = {
  ignoreFilter: (path: string) => {
    const isFileNested = (path.match(new RegExp('/', 'g')) ?? []).length > 1;
    if (!isFileNested) {
      return false;
    }
    return !path.endsWith('index.js');
  },
  forceESM: true,
};

const app: FastifyPluginAsync = async (fastify, _) => {
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    ...opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    routeParams: true,
    ...opts,
  });
};

import { graphql, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import schema from './schema'; // your schema file

// Example Fastify route
fastify.post('/graphql', async (request, reply) => {
  const { query, variables, operationName } = request.body;

  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    operationName,
    validationRules: [depthLimit(10)], // ✅ depth limit here
  });

  reply.send(result);
});


export default app;
