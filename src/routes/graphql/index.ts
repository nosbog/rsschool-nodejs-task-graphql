import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { MemberType, PostType, Profile, User } from './types';

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
      const sourceReq = request.body.query || request.body.mutation || "";

      const queryAll = new GraphQLObjectType({
        name: "query",
        fields: {
          users: {
            type: new GraphQLList(User),
            async resolve (parent) {
              if (request.body.variables) return await fastify.db.users.findOne({key: "id", equals: parent.id});
              return fastify.db.users.findMany();
            },
          },
          profiles: {
            type: new GraphQLList(Profile),
            resolve() {
              return fastify.db.profiles.findMany();
            },
          },
          posts: {
            type: new GraphQLList(PostType),
            resolve() {
              return fastify.db.posts.findMany();
            },
          },
          memberTypes: {
            type: new GraphQLList(MemberType),
            resolve() {
              return fastify.db.memberTypes.findMany();
            },
          },
        }
      }); 
      const schema = new GraphQLSchema({ query: queryAll })
      return await graphql({ schema, source: sourceReq, variableValues: request.body.variables });
    }
  );
  
};

export default plugin;
