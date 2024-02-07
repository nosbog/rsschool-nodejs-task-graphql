import { GraphQLScalarType, Kind } from 'graphql';

export enum MemberTypeIdEnum {
  basic = 'basic',
  business = 'business',
}

export const MemberTypeId = new GraphQLScalarType({
  name: 'MemberTypeId',
  description: 'Custom scalar type for MemberTypeId enum',
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return MemberTypeIdEnum[value as keyof typeof MemberTypeIdEnum];
    }
    throw new Error('Invalid input for MemberTypeId');
  },
  serialize(value: unknown) {
    if (
      typeof value === 'string' &&
      Object.values(MemberTypeIdEnum).includes(value as MemberTypeIdEnum)
    ) {
      return value as string;
    }
    throw new Error('Invalid input for MemberTypeId');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return MemberTypeIdEnum[ast.value as keyof typeof MemberTypeIdEnum];
    }
    return null;
  },
});
