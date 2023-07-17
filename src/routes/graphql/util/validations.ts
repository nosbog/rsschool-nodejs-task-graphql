import depthLimit from 'graphql-depth-limit';
import { GraphQLSchema, parse, Source } from 'graphql';
import { validate } from 'graphql/validation/index.js';

const validateDepth = (schema: GraphQLSchema, query: string) => {
  const request = parse(new Source(query, 'GraphQL check'));

  const validationErrors = validate(schema, request, [depthLimit(5)]);

  return validationErrors;
};

export default validateDepth;
