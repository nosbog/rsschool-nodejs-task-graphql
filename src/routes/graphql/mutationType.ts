import { FastifyInstance } from 'fastify';
import { GraphQLObjectType } from 'graphql';
import { createPost } from '../../actions/postsActions';
import { createProfile } from '../../actions/profilesActions';
import { createUser } from '../../actions/usersActions';
import {
  PostDTOType,
  PostType,
  ProfileDTOType,
  ProfileType,
  UserDTOType,
  UserType,
} from './model';

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        userDTO: {
          description: 'firstName, lastName, email of User',
          type: UserDTOType,
        },
      },
      resolve: (_source, { userDTO }, context: FastifyInstance) =>
        createUser(userDTO, context),
    },
    createPost: {
      type: PostType,
      args: {
        postDTO: {
          description: 'title, content, userId of Post',
          type: PostDTOType,
        },
      },
      resolve: (_source, { postDTO }, context: FastifyInstance) =>
        createPost(postDTO, context),
    },
    createProfile: {
      type: ProfileType,
      args: {
        profileDTO: {
          description:
            'avatar, sex, birthday, country, street, city, memberTypeId, userId of Profile',
          type: ProfileDTOType,
        },
      },
      resolve: (_source, { profileDTO }, context: FastifyInstance) =>
        createProfile(profileDTO, context),
    },
  }),
});
