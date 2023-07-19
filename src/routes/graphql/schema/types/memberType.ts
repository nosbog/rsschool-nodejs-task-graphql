import { FastifyInstance } from 'fastify';
import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
} from 'graphql';

// MemberTypeId Enum
export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

// MemberType Type
export const MemberTypeType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

// Many MemberTypes Type
export const ManyMemberTypesType = new GraphQLList(MemberTypeType);

// MemberType Args
export interface MemberTypeArgs {
  id: string;
}

export const memberTypeArgs = {
  id: { type: MemberTypeId },
};

// MemberType Resolver
export const memberTypeResolver = async (
  _parent,
  args: MemberTypeArgs,
  { prisma }: FastifyInstance,
) => {
  return await prisma.memberType.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many MemberTypes Resolver
export const manyMemberTypesResolver = async (
  _parent,
  _args: MemberTypeArgs,
  { prisma }: FastifyInstance,
) => {
  return prisma.memberType.findMany();
};

// MemberType Field
export const MemberTypeField = {
  type: MemberTypeType,
  args: memberTypeArgs,
  resolve: memberTypeResolver,
};

// Many MemberTypes Field
export const MemberTypesField = {
  type: ManyMemberTypesType,
  resolve: manyMemberTypesResolver,
};
