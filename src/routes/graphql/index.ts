import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  createGqlResponseSchema,
  gqlResponseSchema,
  schema,
} from "./schemas.js";
import { graphql } from "graphql";
import { rootValue } from "./resolvers/main.js";

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: "/",
    method: "POST",
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        rootValue,
      }).then((response) => {
        console.log(`response = ${JSON.stringify(response)}`);
        return response;
      });
    },
  });
};

export default plugin;
