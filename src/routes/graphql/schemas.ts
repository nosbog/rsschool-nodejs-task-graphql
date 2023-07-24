import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';
import { MemberTypeId, UUIDType } from './types/uuid.js';

const prisma = new PrismaClient();

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

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (parent) => {
        const profile = await prisma.user
          .findUnique({ where: { id: parent.id } })
          .profile();
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: { id: string }) => {
        const posts = await prisma.user.findUnique({ where: { id: parent.id } }).posts();
        return posts;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: { id: string }) => {
        const subscriptions = await prisma.user
          .findUnique({ where: { id: parent.id } })
          .userSubscribedTo();
          if (subscriptions) {
            const res = subscriptions.map(async (el) => await prisma.user
            .findUnique({ where: { id: el.authorId } }))
            return res
          }
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: { id: string }) => {
        const subscribers = await prisma.user
          .findUnique({ where: { id: parent.id } })
          .subscribedToUser();
          if (subscribers) {
            const res = subscribers.map(async (el) => await prisma.user
            .findUnique({ where: { id: el.subscriberId } }))
            return res
          }

      },
    },
  }),
});


const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve: async (parent: { id: string }) => {
        const user = await prisma.profile.findUnique({ where: { id: parent.id } }).user();
        return user;
      },
    },
    memberType: {
      type: MemberType,
      resolve: async (parent) => {
        const memberType = await prisma.profile
          .findUnique({ where: { id: parent.id } })
          .memberType();
        return memberType;
      },
    },
  }),
});


const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: UserType,
      resolve: async (parent: { id: string }) => {
        const author = await prisma.post
          .findUnique({ where: { id: parent.id } })
          .author();
        return author;
      },
    },
  }),
});


const MemberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent: { id: string }) => {
        const profiles = await prisma.memberType
          .findUnique({ where: { id: parent.id } })
          .profiles();
        return profiles;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }) => {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        const users = await prisma.user.findMany();
        return users;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }) => {
        const post = await prisma.post.findUnique({ where: { id } });
        return post;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => {
        const posts = await prisma.post.findMany();
        return posts;
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }) => {
        const profile = await prisma.profile.findUnique({ where: { id } });
        return profile;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => {
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async (_, args: { id: string }) => {
        const memberType = await prisma.memberType.findUnique({ where: { id: args.id } });
        return memberType;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => {
        const memberTypes = await prisma.memberType.findMany();
        return memberTypes;
      },
    },
    
  },
});


const CreateUserInput = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: () => ({
    name: {type: UUIDType},
    balance: {type: GraphQLFloat}
  })
})

const CreatePostInput = new GraphQLInputObjectType({
  name: "CreatePostInput",
  fields: () => ({
    authorId: {type: UUIDType},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
  })
})

const CreateProfileInput = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: () => ({
    userId: {type: UUIDType},
    memberTypeId: {type: GraphQLString},
    isMale: { type: GraphQLBoolean },
    yearOfBirth: {type: GraphQLInt},
  })
})
const ChangeUserInput = new GraphQLInputObjectType({
  name: "ChangeUserInput",
  fields: () => ({
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat}
  })
})

const ChangePostInput = new GraphQLInputObjectType({
  name: "ChangePostInput",
  fields: () => ({
    title: {type: GraphQLString},
    content: {type: GraphQLString},
  })
})

const ChangeProfileInput = new GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: () => ({
    memberTypeId: {type: GraphQLString},
    isMale: { type: GraphQLBoolean },
    yearOfBirth: {type: GraphQLInt},
  })
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput)}
      },
      resolve: async (_, {dto}: {dto: {name: string, balance: number}}) => {
        const user = await prisma.user.create({
          data: {
            name: dto.name,
            balance: dto.balance
          }
        })
        return user
      }
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput)}
      },
      resolve: async (_, {dto}: {dto: {authorId: string, title: string, content: string}}) => {
        const post = await prisma.post.create({
          data: {
            authorId: dto.authorId,
            title: dto.title,
            content: dto.content
          }
        })
        return post
      }
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput)}
      },
      resolve: async (_, {dto}: {dto: {userId: string, memberTypeId: string, isMale: boolean, yearOfBirth: number}}) => {
        const profile = await prisma.profile.create({
          data: {
            userId: dto.userId,
            memberTypeId: dto.memberTypeId,
            isMale: dto.isMale,
            yearOfBirth: dto.yearOfBirth
          }
        })
        return profile
      }
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }) => {
        await prisma.post.delete({ where: { id } });
        return true;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, {id}: {id: string}) => {
        await prisma.profile.delete(({ where: { id } }))
        return true
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, {id}: {id: string}) => {
        await prisma.user.delete(({ where: { id } }))
        return true
      }
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInput}     
      },
      resolve: async (_, {id, dto}: {id: string, dto: {title: string, content: string}}) => {
        const updatedPost = await prisma.post.update({
          where: {
            id
          },
          data: { 
              ...dto
          }
        })
        return updatedPost
      }
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput)}     
      },
      resolve: async (_, {id, dto}: {id: string, dto: {memberTypeId: string, isMale: boolean, yearOfBirth: number}}) => {
        const updatedProfile = await prisma.profile.update({
          where: {
            id
          },
          data: { 
              ...dto
          }
        })
        return updatedProfile
      }
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput)}     
      },
      resolve: async (_, {id, dto}: {id: string, dto: {name: string, balance: number}}) => {
        const updatedUser = await prisma.user.update({
          where: {
            id
          },
          data: { 
              ...dto
          }
        })
        return updatedUser
      }
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }    
      },
      resolve: async (_, {userId, authorId}: {userId: string, authorId: string}) => {
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId
              },
            },
          },
        })
        return updatedUser
      }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }    
      },
      resolve: async (_, {userId, authorId}: {userId: string, authorId: string}) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId
            },
          },
        })
        return true
      }
    },
  }
})

export const graphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
