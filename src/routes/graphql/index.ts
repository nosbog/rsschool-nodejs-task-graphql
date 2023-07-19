import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, parse, validate} from 'graphql';
import {rootSchema} from "./rootSchema.js";
import depthLimit from 'graphql-depth-limit'

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

            const checkLimit = validate(rootSchema, parse(query), [depthLimit(5)]).length

            const result = await graphql({
                schema: rootSchema,
                source: query,
                variableValues: variables,
            });

            console.log('VARIABLES: ', variables); //todo: remove
            console.log('QUERY: ', result); // todo: remove
            console.log('ERRORS: ', result.errors) // todo: remove
            // console.log('LIMIT: ', checkLimit) // todo: remove

            return {
                data: checkLimit > 0 ? null : result.data,
                errors: checkLimit > 0 ? [{message: 'exceeds maximum operation depth of 5'}] : result.errors
            };
        },
    });
};

export default plugin;
