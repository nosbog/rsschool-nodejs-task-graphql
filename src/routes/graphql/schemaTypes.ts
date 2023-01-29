import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  //   GraphQLInputObjectType,
} from 'graphql';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
// import { FastifyInstance } from 'fastify';

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const memberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    profiles: {
      type: new GraphQLList(profileType),
      async resolve(
        parent: UserEntity,
        args,
        context
      ): Promise<ProfileEntity[]> {
        return await context.db.profiles.findMany();
      },
    },
    profile: {
      type: profileType,
      async resolve(
        parent: UserEntity,
        args,
        context
      ): Promise<ProfileEntity[]> {
        return await context.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(parent: UserEntity, args, context): Promise<PostEntity> {
        return await context.db.posts.findMany({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
    memberType: {
      type: memberTypeType,
      async resolve(
        parent: UserEntity,
        args,
        context
      ): Promise<MemberTypeEntity | null> {
        const profile = await context.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
        if (profile) {
          const memberType = await context.db.memberTypes.findOne({
            key: 'id',
            equals: profile.memberTypeId,
          });
          return memberType;
        }
        return null;
      },
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
      async resolve(parent: UserEntity, args, context): Promise<PostEntity> {
        return await context.db.posts.findMany({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      async resolve(parent: UserEntity, args, context): Promise<PostEntity> {
        return await context.db.users.findMany({
          key: 'id',
          equalsAnyOf: parent.subscribedToUserIds,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      async resolve(parent: UserEntity, args, context): Promise<PostEntity> {
        return await context.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: parent.id,
        });
      },
    },
  }),
});
