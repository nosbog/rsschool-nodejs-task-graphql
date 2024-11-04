import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInputObjectType, GraphQLInt, GraphQLBoolean, GraphQLFloat, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLScalarType } from 'graphql';
import { UUIDType, generateUUID } from './types/uuid.js';
import { Type } from '@fastify/type-provider-typebox';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface User {
  id: string;
  name: string;
  balance: number;
  profile?: Profile | null;
  posts: Post[];
  userSubscribedTo: SubscribersOnAuthors[];
  subscribedToUser: SubscribersOnAuthors[];
}

interface SubscribersOnAuthors {
  subscriberId: string;
  authorId: string;
  subscriber?: User;
  author?: User;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}


const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' }
  }
});

const memberTypes = {
  BASIC: { id: 'BASIC', discount: 0.05, postsLimitPerMonth: 10 },
  BUSINESS: { id: 'BUSINESS', discount: 0.15, postsLimitPerMonth: 50 }
};

export const changePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }
});

export const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  }
});

export const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }
});

export const createPostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }

});


export const createProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: MemberTypeId },
  }
});

export const createUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }
});


export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }
  }
})

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }
})

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: { type: new GraphQLNonNull(MemberType) },
  }
})
export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))) },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, { prisma }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { subscriberId: user.id },
          include: { author: true },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return subscriptions.map((sub) => sub.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, { prisma }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { authorId: user.id },
          include: { subscriber: true },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return subscribers.map((sub) => sub.subscriber);
      },
    },
  }),
});


export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: () => Object.values(memberTypes)
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) }
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      resolve: (_parent, args: { id: string }) => memberTypes[args.id]
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async () => {
        return await prisma.user.findMany(); 
      }
    },
    user: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string }) => {
        return await prisma.user.findUnique({ where: { id: args.id } });
      }
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async () => {
        return await prisma.post.findMany(); 
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string }) => {
        return await prisma.post.findUnique({ where: { id: args.id } });
      }
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async () => {
        return await prisma.profile.findMany();
      }
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string }) => {
        return await prisma.profile.findUnique({ where: { id: args.id } }); 
      }
    }
  }
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(createUserInput) }
      },
      resolve: async (_parent, args: { dto: { name: string; balance: number } }) => {
        const newUser = await prisma.user.create({
          data: {
            id: generateUUID(),
            name: args.dto.name,
            balance: args.dto.balance,
          }
        });

        return newUser;
      }
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUserInput) }
      },
      resolve: (_parent, args: { id: string, dto: { name: string; balance: number } }) => {
        const newUser = prisma.user.update({
          where: { id: args.id },
          data: {
            name: args.dto.name,
            balance: args.dto.balance
          }
        })
        return newUser;
      }
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(createPostInput) }
      },
      resolve: async (_parent, args: { dto: { title: string; content: string, authorId: string } }) => {
        const newPost = await prisma.post.create({
          data: {
            id: generateUUID(),
            title: args.dto.title,
            content: args.dto.content,
            authorId: args.dto.authorId
          }
        })
        return newPost;
      }
    },

    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(changePostInput) },
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string, dto: { title: string; content: string, authorId: string } }) => {
        const newPost = await prisma.post.update({
          where: {
            id: args.id
          },
          data: {
            title: args.dto.title,
            content: args.dto.content,
            authorId: args.dto.authorId
          }
        });
        return newPost;
      }
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(createProfileInput) }
      },
      resolve: async (_parent, args: { dto: { isMale: boolean; yearOfBirth: number; userId: string, memberTypeId: string } }) => {
        const newProfile = await prisma.profile.create({
          data: {
            id: generateUUID(),
            isMale: args.dto.isMale,
            userId: args.dto.userId,
            yearOfBirth: args.dto.yearOfBirth,
            memberTypeId: args.dto.memberTypeId
          }
        })

        return newProfile;
      }
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeProfileInput) }
      },
      resolve: async (_parent, args: { id: string, dto: { isMale: boolean; yearOfBirth: number; memberTypeId: string } }) => {
        const newProfile = await prisma.profile.update({
          where: {
            id: args.id
          },
          data: {
            isMale: args.dto.isMale,
            yearOfBirth: args.dto.yearOfBirth,
            memberTypeId: args.dto.memberTypeId
          }
        })
        return newProfile;
      }
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string }): Promise<string> => {
        await prisma.user.delete({ where: { id: args.id } });
        return `User with id ${args.id} was deleted`;
      }
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string }): Promise<string> => {
        await prisma.post.delete({ where: { id: args.id } });
        return `Post with id ${args.id} was deleted`;
      }
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, args: { id: string }): Promise<string> => {
        await prisma.profile.delete({ where: { id: args.id } });
        return `Profile with id ${args.id} was deleted`;
      }
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args: { id: string, authorId: string }): Promise<string> => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.id,
            authorId: args.authorId,
          },
        });
        return `User ${args.id} subscribed to user ${args.authorId}`;
      }
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args: { userId: string, authorId: string }): Promise<string> => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return `User ${args.userId} unsubscribed from user ${args.authorId}`;
      }
    },
  }
});


export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations
});


export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

