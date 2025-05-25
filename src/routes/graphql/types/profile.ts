import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberTypeId } from "./member-type.js"; // I don't know why it imports only by js extension
import { UUIDType } from "./uuid.js";

export const CreateProfile = new GraphQLInputObjectType({
    name: 'CreateProfile',
    fields: {
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
        userId: { type: new GraphQLNonNull(UUIDType) },
    },
});
export const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    },
});
export const UpdateProfile = new GraphQLInputObjectType({
    name: 'UpdateProfile',
    fields: {
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    },
});
export const DeleteProfile = new GraphQLObjectType({
    name: 'DeleteProfile',
    fields: {
        id: { type: new GraphQLNonNull(UUIDType) },
    },
});