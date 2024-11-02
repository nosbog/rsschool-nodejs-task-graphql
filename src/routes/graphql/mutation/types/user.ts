import {GraphQLInputObjectType, GraphQLFloat, GraphQLString} from "graphql/type/index.js";
import {UUID} from "node:crypto";


export const CreateUserInputType = new GraphQLInputObjectType({
    name: "CreateUserInput",
    description: "Creates a new user",
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat }
    }
})

export const ChangeUserInputType = new GraphQLInputObjectType({
    name: "ChangeUserInput",
    description: "Change a existing user",
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat }
    }
})

export type CreateUserType =  {
    dto: {
        name: string,
        balance: number
    }
}


export type ChangeUserType = {
    id: UUID,
    dto: {
        name: string,
        balance: number
    }
}

export type DeleteUserType =  {
    id: UUID
}
