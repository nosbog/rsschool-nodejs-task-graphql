import { graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from "graphql";
import Fastify from "fastify";
import prisma from "./prisma.js";

const fastify = Fastify();

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
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
    method: "POST",
    url: "/graphql",
    async handler(request, reply) {
        const body = request.body as { query: string };
        const response = await graphql({ schema, source: body.query });
        reply.send(response);
    },
});

export default fastify;