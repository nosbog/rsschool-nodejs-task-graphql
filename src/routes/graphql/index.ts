import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { createPostType, createProfile, createUserType, MemberType, PostType, Profile, User } from './types';

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
      const sourceReq: string = request.body.query || request.body.mutation || "";

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

      const mutationUser = new GraphQLObjectType({
        name: "mutation",
        fields: {
          createUser: {
            type: User,
            args: {
              userData: { type: createUserType },
            },
            resolve: (_obj, args) =>
              fastify.db.users.create({
                firstName: args.userData.firstName,
                lastName: args.userData.lastName,
                email: args.userData.email,
              }),
          },
          createPost: {
            type: PostType,
            args: {
              postData: { type: createPostType },
            },
            resolve: (_obj, args) =>
              fastify.db.posts.create({
                title: args.postData.title,
                content: args.postData.content,
                userId: args.postData.userId,
              }),
          },
          createProfile: {
            type: Profile,
            args: {
              profileData: { type: createProfile },
            },
            resolve: (_obj, args) =>
              fastify.db.profiles.create({
                avatar: args.profileData.avatar,
                userId: args.profileData.userId,
                sex: args.profileData.sex,
                birthday: args.profileData.birthday,
                country: args.profileData.country,
                street: args.profileData.street,
                city: args.profileData.city,
                memberTypeId: args.profileData.memberTypeId
              }),
          }
        }
      });
      const schema = new GraphQLSchema({ query: queryAll, mutation: mutationUser })
      return await graphql({ schema, source: sourceReq, contextValue: fastify, variableValues: request.body.variables });
    }
  );
  
};

export default plugin;
