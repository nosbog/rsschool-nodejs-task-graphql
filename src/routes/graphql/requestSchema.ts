import { FastifyInstance } from 'fastify';

import {
  GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString,
} from 'graphql/type';
import { MemberTypeEntity } from '../../entities/memberType.entity';
import { UserEntity } from '../../entities/user.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { PostEntity } from '../../entities/post.entity';
import { BaseValidator } from '../../validation/baseValidator';

export const getRequestSchema = (fastify: FastifyInstance) => new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberTypeEntity),
        resolve: () => fastify.db.memberTypes.findMany(),
      },
      users: {
        type: new GraphQLList(UserEntity),
        resolve: () => fastify.db.users.findMany(),
      },
      profiles: {
        type: new GraphQLList(ProfileEntity),
        resolve: () => fastify.db.profiles.findMany(),
      },
      posts: {
        type: new GraphQLList(PostEntity),
        resolve: () => fastify.db.posts.findMany(),
      },
      memberType: {
        type: MemberTypeEntity,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => {
          const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });

          BaseValidator.existenceValidation(memberType, fastify);

          return memberType;
        },
      },
      user: {
        type: UserEntity,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => {
          BaseValidator.uuidValidation(args.id, fastify);

          const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

          BaseValidator.existenceValidation(user, fastify);

          return user;
        },
      },
      profile: {
        type: ProfileEntity,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => {
          BaseValidator.uuidValidation(args.id, fastify);

          const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id });

          BaseValidator.existenceValidation(profile, fastify);

          return profile;
        },
      },
      post: {
        type: PostEntity,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_, args) => {
          BaseValidator.uuidValidation(args.id, fastify);

          const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });

          BaseValidator.existenceValidation(post, fastify);

          return post;
        },
      },
    },
  }),
});
