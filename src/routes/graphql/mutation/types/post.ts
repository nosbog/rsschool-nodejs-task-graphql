import {GraphQLInputObjectType, GraphQLString} from "graphql/type/index.js";
import { UUIDType } from "../../types/uuid.js";
import {UUID} from "node:crypto";
import {GraphQLNonNull} from "graphql/index.js";


export const CreatePostInputType = new GraphQLInputObjectType({
    name: "CreatePostInput",
    description: "Creates a new post",
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    }
})

export const ChangePostInputType = new GraphQLInputObjectType({
    name: "ChangePostInput",
    description: "Change a existing post",
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    }
})

export type CreatePostType =  {
    dto: {
        title: string
        content: string
        authorId: UUID
    }
}


export type ChangePostType = {
    id: UUID,
    dto: {
        title: string
        content: string
    }
}

export type DeletePostType =  {
    id: UUID
}
