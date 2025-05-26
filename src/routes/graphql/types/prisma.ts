import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

const OperationHistoryType = new GraphQLObjectType({
    name: 'OperationHistory',
    fields: {
        model: {type: new GraphQLNonNull(GraphQLString)},
        operation: {type: new GraphQLNonNull(GraphQLString)},
        args: {type: new GraphQLNonNull(GraphQLString)},
    }
})
export const PrismaType = new GraphQLObjectType({
    name: 'Prisma',
    fields: {
        operationHistory: { type: new GraphQLNonNull(new GraphQLList(OperationHistoryType)) }
    },
});