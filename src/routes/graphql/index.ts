import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt
} from "graphql";

// import {
//     graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList,
//     GraphQLID,
//     GraphQLEnumType,
//     GraphQLFloat,
//     GraphQLInt
// } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma} = fastify;

    const UUID = GraphQLString;

    const MemberTypeId = new GraphQLEnumType({
        name: "MemberTypeId",
        values: {
            BASIC: {value: "BASIC"},
            BUSINESS: {value: "BUSINESS"}
        }
    });

    const MemberType = new GraphQLObjectType({
        name: "MemberType",
        fields: {
            id: {type: GraphQLString},
            discount: {type: GraphQLFloat},
            postsLimitPerMonth: {type: GraphQLInt}
        }
    });

    const Post = new GraphQLObjectType({
        name: "Post",
        fields: {
            id: {type: UUID},
            title: {type: GraphQLString},
            content: {type: GraphQLString},
            authorId: {type: UUID} // Связь с User
        }
    });

    const Profile = new GraphQLObjectType({
        name: "Profile",
        fields: {
            id: {type: UUID},
            isMale: {type: GraphQLString},
            yearOfBirth: {type: GraphQLInt},
            memberType: {type: MemberType}
        }
    });

    const User = new GraphQLObjectType({
        name: "User",
        fields: () => ({
            id: {type: UUID},
            name: {type: GraphQLString},
            balance: {type: GraphQLFloat},
            profile: {type: Profile},
            posts: {type: new GraphQLList(Post)},
            userSubscribedTo: {type: new GraphQLList(User)},
            subscribedToUser: {type: new GraphQLList(User)}
        })
    });

    const schema = new GraphQLSchema({
        // query: RootQuery,
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