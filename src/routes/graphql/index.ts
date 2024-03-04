import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { RootQuery } from './types/rootQuery.ts';
import { Mutations } from './types/mutations.ts';


interface GqlRequestBody {
  query?: string;
  variables?: Record<string, any>;
}

interface Context {
  prisma: PrismaClient;
  loaders: {
    postLoader: any;
    profileLoader: any;
    memberTypeLoader: any;
  };
}


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {

  const { prisma } = fastify;
  
  const dataLoaderOptions = {};

  function batchLoadPosts(keys: string[]) {
    return prisma.post.findMany({
      where: {
        userId: { in: keys },
      },
    });
  }

  function batchLoadProfiles(keys: string[]) {
    return prisma.profile.findMany({
      where: {
        userId: { in: keys },
      },
    });
  }

  function batchLoadMemberTypes(keys: string[]) {
    return prisma.profile.findMany({
      where: {
        userId: { in: keys },
      },
      select: {
        userId: true,
        memberTypeId: true,
      },
    });
  }

  // Create DataLoader instances
  const postLoader = new DataLoader(batchLoadPosts, dataLoaderOptions);
  const profileLoader = new DataLoader(batchLoadProfiles, dataLoaderOptions);
  const memberTypeLoader = new DataLoader(batchLoadMemberTypes, dataLoaderOptions);

  // Create context with DataLoader instances
  const context: Context = {
    prisma,
    loaders: {
      postLoader,
      profileLoader,
      memberTypeLoader,
    },
  };

  fastify.route({
    url: '/',
    method: ['POST'],
    schema: {
      ...createGqlResponseSchema,
      response: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        200: gqlResponseSchema,
      },
    },
    async handler(request, _) {
      const { query, variables }: GqlRequestBody = request.body;

      try {
        const queryDocument = parse(query);
        const errors = validate(schema, queryDocument, [depthLimit(5)]);
        if (errors.length > 0) {
          return { errors };
        }

        const result = await graphql({
          schema: schema, 
          source: query, 
          variableValues: variables, 
          contextValue: { prisma }, 
           
        });

        return result;

      } catch (error) {
        console.error('GraphQL error:', error);
        throw new Error('Internal server error');
      }
    },
  });
};

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations
})

export default plugin;