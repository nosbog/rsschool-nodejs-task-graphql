import {GraphQLEnumType, GraphQLObjectType, GraphQLFloat} from "graphql/index.js";
import {MemberTypeId} from "../../../member-types/schemas.js";
import {GraphQLInt, GraphQLNonNull} from "graphql";

export const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    description: 'Type of membership',
    values: {
        BASIC: { value: MemberTypeId.BASIC },
        BUSINESS: { value: MemberTypeId.BUSINESS },
    }
});

export const MemberType = new GraphQLObjectType({
    name: 'Member',
    description: 'This represent a Member',
    fields: () => ({
            id: {type: new GraphQLNonNull(MemberTypeIdEnum)},
            discount: {type: new GraphQLNonNull(GraphQLFloat)},
            postsLimitPerMonth: {type: new GraphQLNonNull(GraphQLInt)},
        }
    )
})
