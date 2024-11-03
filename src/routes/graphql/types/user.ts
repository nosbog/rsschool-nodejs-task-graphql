import {
  GraphQLObjectType,
  GraphQLField,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient, User } from '@prisma/client';
import { ProfileType } from './profile.js';

const prisma = new PrismaClient();
export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (user: User) => {
        return await prisma.profile.findUnique({
          where: {
            userId: user.id,
          },
        });
      },
    },
  }),
});

// type User {
//   id: UUID!
//   name: String!
//   balance: Float!
//   profile: Profile
//   posts: [Post!]!
//   userSubscribedTo: [User!]!
//   subscribedToUser: [User!]!
// }
