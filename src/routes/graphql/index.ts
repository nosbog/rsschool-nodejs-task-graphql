import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberTypeSchema, MemberTypesSchema } from './types/member.js';
import { PostsSchema, PostSchema } from './types/post.js';
import { UsersSchema, UserSchema } from './types/user.js';
import { ProfileSchema, ProfilesSchema } from './types/profile.js';

const schema: GraphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      // Get all resources
      memberTypes: MemberTypesSchema,
      posts: PostsSchema,
      users: UsersSchema,
      profiles: ProfilesSchema,
      // Get resources by id
      memberType: MemberTypeSchema,
      post: PostSchema,
      profile: ProfileSchema,
      user: UserSchema,
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
