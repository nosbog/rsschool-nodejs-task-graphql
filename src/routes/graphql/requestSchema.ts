import { FastifyInstance } from 'fastify';

import { GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { memberTypeEntity } from '../../entities/memberType.entity';
import { userEntity } from '../../entities/user.entity';
import { profileEntity } from '../../entities/profile.entity';
import { postEntity } from '../../entities/post.entity';

export const getRequestSchema = (fastify: FastifyInstance) => new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'queryType',
    fields: {
      memberTypes: {
        type: new GraphQLList(memberTypeEntity),
        resolve: () => fastify.db.memberTypes.findMany(),
      },
      users: {
        type: new GraphQLList(userEntity),
        resolve: () => fastify.db.users.findMany(),
      },
      profiles: {
        type: new GraphQLList(profileEntity),
        resolve: () => fastify.db.profiles.findMany(),
      },
      posts: {
        type: new GraphQLList(postEntity),
        resolve: () => fastify.db.profiles.findMany(),
      },
    },
  }),
});
