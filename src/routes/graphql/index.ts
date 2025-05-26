import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID} from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma} = fastify;

    const UserType = new GraphQLObjectType({
        name: "User",
        fields: () => ({
            id: {type: GraphQLID},
            name: {type: GraphQLString},
        }),
    });

    const RootQuery = new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            users: {
                type: new GraphQLList(UserType),
                resolve: async () => {
                    return await prisma.user.findMany();
                },
            },
        },
    });

    const schema = new GraphQLSchema({
        query: RootQuery,
    });

    fastify.route({
        url: "/",
        method: "POST",
        schema: {
            ...createGqlResponseSchema,
            response: {
                200: gqlResponseSchema,
            },
        },
        async handler(req, reply) {
            const body = req.body as { query: string };
            const response = await graphql({schema, source: body.query});
            reply.send(response);
        },
    });

    // console.log("Routes:", fastify.printRoutes());
};

export default plugin;