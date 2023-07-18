import { GraphQLScalarType, Kind } from 'graphql';

const isUUID = (value: unknown): value is string =>
  typeof value === 'string' &&
  new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$').test(
    value,
  );

export const UUIDType = new GraphQLScalarType({
  name: 'UUID',
  serialize(value) {
    if (!isUUID(value)) {
      throw new TypeError(`Invalid UUID.`);
    }
    return value;
  },
  parseValue(value) {
    if (!isUUID(value)) {
      throw new TypeError(`Invalid UUID.`);
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (isUUID(ast.value)) {
        return ast.value;
      }
    }
    return undefined;
  },
});

export const MemberTypeId = new GraphQLScalarType({
  name: 'MemberTypeId',
  serialize(value) {
    if (!(value === "basic" || value === "business")) {
      throw new TypeError(`MemberTypeId.`);
    }
    return value;
  },
  parseValue(value) {
    if (!(value === "basic" || value === "business")) {
      throw new TypeError(`MemberTypeId.`);
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (!(ast.value === "basic" || ast.value === "business")) {
        return ast.value;
      }
    }
    return undefined;
  },
});

