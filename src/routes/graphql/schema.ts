import { createSchema } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';

import userResolver from './resolvers/user';
import profileResolver from './resolvers/profile';
import postResolver from './resolvers/post';
import memberTypeResolver from './resolvers/memberType';

export const schema = async () =>
  createSchema({
    typeDefs: await loadFiles('src/routes/graphql/typedefs/*.graphql'),
    resolvers: {
      ...userResolver,
      ...profileResolver,
      ...postResolver,
      ...memberTypeResolver,
    },
  });

export const graphqlBodySchema = {
  type: 'object',
  properties: {
    mutation: { type: 'string' },
    query: { type: 'string' },
    variables: {
      type: 'object',
    },
  },
  oneOf: [
    {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
    {
      type: 'object',
      required: ['mutation'],
      properties: {
        mutation: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  ],
} as const;
