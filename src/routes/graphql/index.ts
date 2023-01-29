import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from "./schema";
import { graphqlSchema } from "./graphqlSchema";
import { graphql } from 'graphql';

// const resolvers = {
//   Query: {
//     async resolve(source: any, args: any, context: any) {
//       context.inject({
//         method: 'POST',
//         url: '/users',
//         payload: args,
//       });
//     },
//   },
//   greeting: () => {
//     return 'hello from  TutorialsPoint !!!';
//   },
//   Mutation: {},
// };

// const schema = buildSchema(`{
// type Query {
//   hello: String
// }
// `);

// const getAllSchema = buildSchema(`
//   type User {
//     id: Int
//   }

//   type Profile {
//     id: Int
//   }  
  
//   type Query {
//     users(id: String): [User]
//     profiles(id: String): [Profile]
//   }
//  `)


  
// type Profile {
//   id: Int
// }

// type Mutation {
//   id: Int
// }

// type MemberType {
//   id: Int
// }

// type getAll (ids: [Int]){
//   users(ids: [Int]): [User]
// }
// profiles(ids: [Int]): [Profile]
// posts(ids: [Int]): [Post]
// memberTypes(ids: [Int]): [MemberType]

// const root = {
//   users: async (_a : any, context: any) => {
//     return await context.db.users.findMany();
//   },
//   profiles: async (_a : any, context: any) => {
//     return await context.db.profiles.findMany();
//   }
// };

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
    async (request, reply) => {
      const {variables, query} = request.body;
      return await graphql({
        schema: graphqlSchema,
        source: String(query),
        variableValues: variables,
        contextValue: fastify,
      });
    }
   
  );
};

export default plugin;
