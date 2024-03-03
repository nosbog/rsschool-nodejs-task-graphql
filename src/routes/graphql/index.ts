import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  // const { prisma } = fastify;
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
      // const contextValue: Context = { prisma };
      // const errors = validate(schema, parse(req.body.query));
      // if (errors.length > 0) {
      //   console.log(errors);
      //   return { errors };
      // }
      // try {
      //   const errors = validate(schema, parse(req.body.query));
      //   if (errors.length > 0) return { errors };
      // } catch (error) {
      //   return {};
      // }
      console.log(req.body.variables);
      const res = graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: fastify,
      });
      const err = (await res).errors || [];
      // if (err.length > 0) console.log((await res).data);
      if (err.length > 0) console.log(err);
      return res;
    },
  });
};

export default plugin;
