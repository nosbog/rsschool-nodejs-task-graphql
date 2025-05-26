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

    const RootQuery = new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            users: {
                type: new GraphQLList(User),
                resolve: async (_, args, {prisma}) => {
                    return await prisma.user.findMany();
                },
            },
            user: {
                type: User,
                args: {id: {type: UUID}},
                resolve: async (_, args, {prisma}) => {
                    return await prisma.user.findUnique({where: {id: args.id}});
                },
            },
            posts: {
                type: new GraphQLList(Post),
                resolve: async (_, args, {prisma}) => {
                    return await prisma.post.findMany();
                },
            },
            post: {
                type: Post,
                args: {id: {type: UUID}},
                resolve: async (_, args, {prisma}) => {
                    return await prisma.post.findUnique({where: {id: args.id}});
                },
            },
            profiles: {
                type: new GraphQLList(Profile),
                resolve: async (_, args, {prisma}) => {
                    return await prisma.profile.findMany();
                },
            },
            profile: {
                type: Profile,
                args: {id: {type: UUID}},
                resolve: async (_, args, {prisma}) => {
                    return await prisma.profile.findUnique({where: {id: args.id}});
                },
            },
            memberTypes: {
                type: new GraphQLList(MemberType),
                resolve: async (_, args, {prisma}) => {
                    return await prisma.memberType.findMany();
                },
            },
            memberType: {
                type: MemberType,
                args: {id: {type: MemberTypeId}},
                resolve: async (_, args, {prisma}) => {
                    return await prisma.memberType.findUnique({where: {id: args.id}});
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

};

export default plugin;