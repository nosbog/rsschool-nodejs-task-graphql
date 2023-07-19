import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql} from 'graphql';
import {rootSchema} from "./rootSchema.js";

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
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
            const {query, variables} = req.body;
            const result = await graphql({
                schema: rootSchema,
                source: query,
                variableValues: variables,
            });
            console.log('VARIABLES: ', variables); //todo: remove
            console.log('QUERY: ', result); // todo: remove
            console.log('ERRORS: ', result.errors) // todo: remove
            return {data: result.data, errors: result.errors};
        },
    });
};

export default plugin;
