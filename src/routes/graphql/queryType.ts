import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { userType, profileType, postType, memberTypeType } from './schemaTypes';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(userType),
      async resolve(_, args, context): Promise<UserEntity[]> {
        return await context.db.users.findMany();
      },
    },
    user: {
      type: userType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context): Promise<UserEntity> {
        return await context.db.users.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(parent, args, context): Promise<PostEntity[]> {
        return await context.db.profiles.findMany();
      },
    },
    post: {
      type: postType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context): Promise<PostEntity> {
        return await context.db.posts.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      async resolve(parent, args, context): Promise<ProfileEntity[]> {
        return await context.db.profiles.findMany();
      },
    },
    profile: {
      type: profileType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context): Promise<ProfileEntity> {
        return await context.db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
    },
    memberType: {
      type: memberTypeType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args, context): Promise<ProfileEntity> {
        return await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
  },
});
