import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';
import { prisma } from './prismaClient.js';
import fastify, { FastifyPluginAsync } from 'fastify';

const typeDefs = `

type User{
  iid: ID!
  name: String!
  balance: Float!
  posts: [Post!]
  userSubscribedTo: [SubscribersOnAuthors] 
}

  type SubscribersOnAuthors{
  subscriber: User!
  author: User!
  }

  type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

input PostInput {
  title: String!
  content: String!
}

  type Query{
  users: [User!]
  }

  type Mutation{
 createPost(title: String!, content: String!): Post!
  changePost(id: ID!, data: PostInput!): Post!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        include: {
          userSubscribedTo: {
            include: {
              author: true,
            },
          },
          profile: true,
          posts: true,
        },
      });
    },
  },
  Mutation: {
    createPost: async (_, { title, content, authorId }) => {
      return await prisma.post.create({
        data: {
          title,
          content,
          author: { connect: { id: authorId } },
        },
      });
    },
    changePost: async (_, { id, data }) => {
      return await prisma.post.update({ where: { id }, data });
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const userLoader = new DataLoader(async (userIds: readonly string[]) => {
  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(userIds) } },
    include: {
      userSubscribedTo: {
        include: {
          author: true,
        },
      },
    },
  });
  return userIds.map((userId) => users.find((user) => user.id === userId));
});

export const requestHook: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const complexityLimit = depthLimit(5);

    return new Promise((resolve, reject) => {
      complexityLimit(request, reply, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  });
};

export const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
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
      const { query, variables } = req.body;

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma, userLoader },
      });

      return result;
    },
  });
};

// export { plugin, requestHook };
