import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';

import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { userQuery, usersQuery } from './users/queries.js';
import {
  changeUserMutation,
  createUserMutation,
  deleteUserMutation,
  subscribeToMutation,
  unsubscribeFromMutation,
} from './users/mutations.js';
import { profileQuery, profilesQuery } from './profiles/queries.js';
import {
  changeProfileMutation,
  createProfileMutation,
  deleteProfileMutation,
} from './profiles/mutations.js';
import { postQuery, postsQuery } from './posts/queries.js';
import {
  changePostMutation,
  createPostMutation,
  deletePostMutation,
} from './posts/mutations.js';
import { memberTypeQuery, memberTypesQuery } from './member-types/queries.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: usersQuery,
      user: userQuery,
      profiles: profilesQuery,
      profile: profileQuery,
      posts: postsQuery,
      post: postQuery,
      memberTypes: memberTypesQuery,
      memberType: memberTypeQuery,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: createUserMutation,
      deleteUser: deleteUserMutation,
      changeUser: changeUserMutation,
      createProfile: createProfileMutation,
      deleteProfile: deleteProfileMutation,
      changeProfile: changeProfileMutation,
      createPost: createPostMutation,
      deletePost: deletePostMutation,
      changePost: changePostMutation,
      subscribeTo: subscribeToMutation,
      unsubscribeFrom: unsubscribeFromMutation,
    },
  }),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
        204: {
          type: 'object',
          properties: {
            deleteUserId: { type: 'string' },
          },
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            errors: { type: 'array' },
          },
        },
      },
    },
    async handler(req, reply) {
      const { query, variables } = req.body;

      const result = await graphql({
        schema,
        source: query,
        contextValue: {
          prisma,
          httpErrors,
        },
        variableValues: variables,
      });

      // Check for errors
      if (result.errors) {
        reply.code(500);
        return {
          error: 'GraphQL execution error',
          errors: result.errors,
        };
      }

      if (result.data?.deletedRecordId) {
        reply.code(204);
      }

      // Return the data
      return {
        data: result.data,
      };
    },
  });
};

export default plugin;
