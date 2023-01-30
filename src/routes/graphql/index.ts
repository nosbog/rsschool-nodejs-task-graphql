import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { createPostType, createProfile, createUserType, MemberType, PostType, Profile, updatePostType, updateProfile, updateUserType, User } from './types';

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
          },
          updateUser: {
            type: User,
            args: {
              userData: { type: updateUserType },
            },
            resolve: async (_obj, args) => {
              const user = await fastify.db.users.findOne({ key: "id", equals: args.userData.id });
              if (!user) throw new Error("User not found");
              return await fastify.db.users.change(
                args.userData.id,
                {
                firstName: args.userData.firstName,
                lastName: args.userData.lastName,
                email: args.userData.email
                }
              );
            }
          },
          updateProfile: {
            type: Profile,
            args: {
              profileData: { type: updateProfile },
            },
            resolve: async (_obj, args) => {
              const profile = await fastify.db.profiles.findOne({ key: "id", equals: args.profileData.id });
              if (!profile) throw new Error("Profile not found");
              return await fastify.db.profiles.change(
                args.profileData.id,
                {
                avatar: args.profileData.avatar,
                sex: args.profileData.sex,
                birthday: args.profileData.birthday,
                country: args.profileData.country,
                street: args.profileData.street,
                city: args.profileData.city,
                memberTypeId: args.profileData.memberTypeId
                }
              )
            }
          },
          updatePost: {
            type: PostType,
            args: {
              postData: { type: updatePostType },
            },
            resolve: async(_obj, args) => {
              const post = await fastify.db.posts.findOne({ key: "id", equals: args.postData.id });
              if (!post) throw new Error("Post not found");
              return await fastify.db.posts.change(
                args.postData.id,
                {
                title: args.postData.title,
                content: args.postData.content
              });
            }
          }
        }
      });
      const schema = new GraphQLSchema({ query: queryAll, mutation: mutationUser })
      return await graphql({ schema, source: sourceReq, contextValue: fastify, variableValues: request.body.variables });
    }
  );
  
};

export default plugin;
