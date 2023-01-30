import { GraphQLList, GraphQLSchema } from 'graphql/type';
import {
  memberTypeGraphType,
  profileGraphType,
  postGraphType,
  userGraphType,
} from './types/types';
import { GraphQLObjectType } from 'graphql';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql/graphql';

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
      const query = new GraphQLObjectType({
        name: 'query',
        fields: {
          memberTypes: {
            type: new GraphQLList(memberTypeGraphType),
            resolve: async () => {
              return await fastify.db.memberTypes.findMany();
            },
          },
          profiles: {
            type: new GraphQLList(profileGraphType),
            resolve: async() => {
              return await fastify.db.profiles.findMany();
            },
          },
          posts: {
            type: new GraphQLList(postGraphType),
            resolve: async () => {
              return await fastify.db.posts.findMany();
            },
          },
          users: {
            type: new GraphQLList(userGraphType),
            resolve: async () => {
              return await fastify.db.users.findMany();
            },
          },
        },
      });

      const schema = new GraphQLSchema({
        query,
      });

      return await graphql({
        schema,
        source: String(request.body.query),
      });
    }
  );
};

export default plugin;
