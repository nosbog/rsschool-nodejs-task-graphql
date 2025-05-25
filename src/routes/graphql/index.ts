import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MembersTypeSchema } from './types/member.js';
import { PostsTypeSchema } from './types/post.js';
import { UsersTypeSchema } from './types/user.js';
import { ProfilesTypeSchema } from './types/profile.js';

const schema: GraphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      memberTypes: MembersTypeSchema,
      posts: PostsTypeSchema,
      users: UsersTypeSchema,
      profiles: ProfilesTypeSchema
    }
  })
})

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
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma }
      });
    },
  });
};

export default plugin;
