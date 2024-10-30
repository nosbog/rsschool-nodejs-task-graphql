import { GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { PostType } from './post.js';
import { MemberType } from './memberType.js';

export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        id: { type: UUIDType },
        userId: { type: UserType.getFields().id.type },
        memberTypeId: { type: PostType.getFields().id.type },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberType: { type: MemberType },
    }),
});

export const CreateProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInputType',
    fields: () => ({
        userId: { type: GraphQLString },
        memberTypeId: { type: GraphQLString },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
    }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInputType',
    fields: {
        memberTypeId: { type: GraphQLString },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
    },
});
  