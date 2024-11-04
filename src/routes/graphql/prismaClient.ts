import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
      userSubscribedTo: {
        include: {
          author: true,
        },
      },
    },
  });
  console.log(users);
}
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

export { prisma };

// import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
// import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
// import { graphql } from 'graphql';
// import { makeExecutableSchema } from '@graphql-tools/schema';
// import depthLimit from 'graphql-depth-limit';
// import DataLoader from 'dataloader';
// import { prisma } from './prismaClient.js';
// import fastify, { FastifyPluginAsync } from 'fastify';

// // Визначення типів для GraphQL
// type User = {
//   id: string; // Виправлено з iid на id
//   name: string;
//   balance: number;
//   posts: Post[];
//   userSubscribedTo: SubscribersOnAuthors[];
// };

// type Post = {
//   id: string;
//   title: string;
//   content: string;
//   author: User;
// };

// type SubscribersOnAuthors = {
//   subscriber: User;
//   author: User;
// };

// type PostInput = {
//   title: string;
//   content: string;
// };

// // Визначення типів для GraphQL
// const typeDefs = `
//   type User {
//     id: ID! // Виправлено з iid на id
//     name: String!
//     balance: Float!
//     posts: [Post!]
//     userSubscribedTo: [SubscribersOnAuthors]
//   }

//   type SubscribersOnAuthors {
//     subscriber: User!
//     author: User!
//   }

//   type Post {
//     id: ID!
//     title: String!
//     content: String!
//     author: User!
//   }

//   input PostInput {
//     title: String!
//     content: String!
//   }

//   type Query {
//     users: [User!]
//   }

//   type Mutation {
//     createPost(title: String!, content: String!, authorId: String!): Post!
//     changePost(id: ID!, data: PostInput!): Post!
//   }
// `;

// const resolvers = {
//   Query: {
//     users: async (): Promise<User[]> => {
//       try {
//         return await prisma.user.findMany({
//           include: {
//             userSubscribedTo: {
//               include: {
//                 author: true,
//               },
//             },
//             profile: true,
//             posts: true,
//           },
//         });
//       } catch (error) {
//         throw new Error('Failed to fetch users');
//       }
//     },
//   },
//   Mutation: {
//     createPost: async (
//       _: any,
//       { title, content, authorId }: { title: string; content: string; authorId: string },
//       ___: any
//     ): Promise<Post> => {
//       return await prisma.post.create({
//         data: {
//           title,
//           content,
//           author: { connect: { id: authorId } }, // author підключається через connect
//         },
//       });
//     },
//     changePost: async (
//       _: any,
//       { id, data }: { id: string; data: PostInput },
//       ___: any
//     ): Promise<Post> => {
//       return await prisma.post.update({
//         where: { id },
//         data: {
//           ...(data.title && { title: data.title }), // Оновлення тільки вказаних полів
//           ...(data.content && { content: data.content }),
//         },
//       });
//     },
//   },
// };

// const schema = makeExecutableSchema({ typeDefs, resolvers });

// const userLoader = new DataLoader(async (userIds: readonly string[]) => {
//   const users = await prisma.user.findMany({
//     where: { id: { in: Array.from(userIds) } },
//     include: {
//       userSubscribedTo: {
//         include: {
//           author: true,
//         },
//       },
//     },
//   });
//   return userIds.map((userId) => users.find((user) => user.id === userId));
// });

// export const requestHook: FastifyPluginAsync = async (fastify) => {
//   fastify.addHook('onRequest', async (request, reply) => {
//     const complexityLimit = depthLimit(5);

//     return new Promise((resolve, reject) => {
//       complexityLimit(request, reply, (error) => {
//         if (error) {
//           return reject(error);
//         }
//         resolve();
//       });
//     });
//   });
// };

// export const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
//   fastify.route({
//     url: '/',
//     method: 'POST',
//     schema: {
//       ...createGqlResponseSchema,
//       response: {
//         200: gqlResponseSchema,
//       },
//     },
//     async handler(req) {
//       const { query, variables } = req.body;

//       const result = await graphql({
//         schema,
//         source: query,
//         variableValues: variables,
//         contextValue: { prisma, userLoader },
//       });

//       return result;
//     },
//   });
// };

// export { plugin, requestHook };
