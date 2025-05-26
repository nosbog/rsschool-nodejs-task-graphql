import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

// MemberTypeId Enum
const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

// Input Types
const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  },
});

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// MemberType Object Type
const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

// Profile Object Type
const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: async (parent, args, context) => {
        // Use DataLoader if available, fallback to direct query
        if (context.dataLoaders) {
          return context.dataLoaders.memberTypeLoader.load(parent.memberTypeId);
        }
        return context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId }
        });
      },
    },
  }),
});

// Post Object Type
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// User Object Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent, args, context) => {
        // Use DataLoader if available, fallback to direct query
        if (context.dataLoaders) {
          return context.dataLoaders.profileLoader.load(parent.id);
        }
        return context.prisma.profile.findUnique({
          where: { userId: parent.id }
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent, args, context) => {
        // Use DataLoader if available, fallback to direct query
        if (context.dataLoaders) {
          return context.dataLoaders.postsLoader.load(parent.id);
        }
        return context.prisma.post.findMany({
          where: { authorId: parent.id }
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, context) => {
        // Use DataLoader if available
        if (context.dataLoaders?.userSubscriptionsLoader) {
          return context.dataLoaders.userSubscriptionsLoader.load(parent.id);
        }
        
        // Fallback to individual query
        const userWithSubs = await context.prisma.user.findUnique({
          where: { id: parent.id },
          include: {
            userSubscribedTo: {
              include: {
                author: true
              }
            }
          }
        });
        
        if (!userWithSubs?.userSubscribedTo) {
          return [];
        }
        
        return userWithSubs.userSubscribedTo.map(sub => sub.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, context) => {
        // Use DataLoader if available
        if (context.dataLoaders?.userSubscribersLoader) {
          return context.dataLoaders.userSubscribersLoader.load(parent.id);
        }
        
        // Fallback to individual query
        const userWithSubscribers = await context.prisma.user.findUnique({
          where: { id: parent.id },
          include: {
            subscribedToUser: {
              include: {
                subscriber: true
              }
            }
          }
        });
        
        if (!userWithSubscribers?.subscribedToUser) {
          return [];
        }
        
        return userWithSubscribers.subscribedToUser.map(sub => sub.subscriber);
      },
    },
  }),
});

// Root Query Type
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello GraphQL!',
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: async (parent, args, context) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (parent, args, context) => {
        // Use DataLoader if available, fallback to direct query
        if (context.dataLoaders) {
          return context.dataLoaders.memberTypeLoader.load(args.id);
        }
        return context.prisma.memberType.findUnique({
          where: { id: args.id }
        });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, context, info) => {
        // Parse the query to see what fields are requested
        const parsedInfo = parseResolveInfo(info) as any;
        const userFields = parsedInfo?.fieldsByTypeName?.User || {};
        
        const needsUserSubscribedTo = !!userFields.userSubscribedTo;
        const needsSubscribedToUser = !!userFields.subscribedToUser;
        const needsSubscriptions = needsUserSubscribedTo || needsSubscribedToUser;

        let users;
        if (needsSubscriptions) {
          // Include subscription relationships when needed - but only the ones requested
          const includeClause: any = {};
          
          if (needsUserSubscribedTo) {
            includeClause.userSubscribedTo = {
              include: { author: true }
            };
          }
          
          if (needsSubscribedToUser) {
            includeClause.subscribedToUser = {
              include: { subscriber: true }
            };
          }
          
          users = await context.prisma.user.findMany({
            include: includeClause
          });
          
          // Prime the DataLoaders with subscription data
          if (context.dataLoaders) {
            users.forEach(user => {
              context.dataLoaders.userLoader.prime(user.id, user);
              
              if (needsUserSubscribedTo) {
                if (user.userSubscribedTo) {
                  const subscriptions = user.userSubscribedTo.map((sub: any) => sub.author);
                  context.dataLoaders.userSubscriptionsLoader.prime(user.id, subscriptions);
                  
                  subscriptions.forEach((subUser: any) => {
                    context.dataLoaders.userLoader.prime(subUser.id, subUser);
                  });
                } else {
                  context.dataLoaders.userSubscriptionsLoader.prime(user.id, []);
                }
              }
              
              if (needsSubscribedToUser) {
                if (user.subscribedToUser) {
                  const subscribers = user.subscribedToUser.map((sub: any) => sub.subscriber);
                  context.dataLoaders.userSubscribersLoader.prime(user.id, subscribers);
                  
                  subscribers.forEach((subUser: any) => {
                    context.dataLoaders.userLoader.prime(subUser.id, subUser);
                  });
                } else {
                  context.dataLoaders.userSubscribersLoader.prime(user.id, []);
                }
              }
            });
          }
        } else {
          // Simple query without includes when subscriptions not needed
          users = await context.prisma.user.findMany();
          
          if (context.dataLoaders) {
            users.forEach(user => {
              context.dataLoaders.userLoader.prime(user.id, user);
            });
          }
        }
        
        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        // Use DataLoader if available, fallback to direct query
        if (context.dataLoaders) {
          return context.dataLoaders.userLoader.load(args.id);
        }
        return context.prisma.user.findUnique({
          where: { id: args.id }
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent, args, context) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.post.findUnique({
          where: { id: args.id }
        });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (parent, args, context) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.profile.findUnique({
          where: { id: args.id }
        });
      },
    },
  },
});

// Mutations Type (keeping exactly the same)
const MutationsType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.user.create({
          data: args.dto
        });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.profile.create({
          data: args.dto
        });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.post.create({
          data: args.dto
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.user.update({
          where: { id: args.id },
          data: args.dto
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (parent, args, context) => {
        return context.prisma.post.update({
          where: { id: args.id },
          data: args.dto
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        await context.prisma.user.delete({
          where: { id: args.id }
        });
        return 'User deleted successfully';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        await context.prisma.profile.delete({
          where: { id: args.id }
        });
        return 'Profile deleted successfully';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        await context.prisma.post.delete({
          where: { id: args.id }
        });
        return 'Post deleted successfully';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const existingSubscription = await context.prisma.subscribersOnAuthors.findUnique({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId
            }
          }
        });

        if (existingSubscription) {
          return 'Already subscribed';
        }

        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId
          }
        });

        return 'Subscription successful';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        try {
          await context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId
              }
            }
          });
          return 'Unsubscription successful';
        } catch (error) {
          return 'Subscription not found';
        }
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationsType,
});