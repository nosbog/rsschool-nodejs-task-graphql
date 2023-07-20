import {GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType} from "graphql";
import {dbClient} from "../index.js";

export const MemberId = new GraphQLEnumType({
    name: "MemberTypeId",
    values: {
        basic: {value: 'basic'},
        business: {value: 'business'}
    },
})

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: MemberId},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
    })
})

export const memberQueryFields = {
    memberType: {
        type: MemberType,
        args: {id: {type: MemberId}},
        async resolve(parent, args: Record<string, string>) {
            const member = dbClient.memberType.findUnique({
                where: {
                    id: args.id,
                },
            });
            if (member === null) {
                return null;
            }
            return member;
        }
    },
    memberTypes: {
        type: new GraphQLList(MemberType),
        resolve() {
            return dbClient.memberType.findMany();
        }
    }
}
