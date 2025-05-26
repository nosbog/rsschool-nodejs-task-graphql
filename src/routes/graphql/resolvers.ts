import { FastifyInstance } from 'fastify';
import { MemberTypeId } from '../member-types/schemas.js';

interface User {
  id: string;
  name: string;
  balance: number;
  profile?: {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: MemberTypeId;
  };
  posts: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  userSubscribedTo: Array<{
    subscriberId: string;
    authorId: string;
    author: User;
  }>;
  subscribedToUser: Array<{
    subscriberId: string;
    authorId: string;
    subscriber: User;
  }>;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
}

interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  user: User;
  userId: string;
  memberTypeId: MemberTypeId;
  memberType: {
    id: MemberTypeId;
    discount: number;
    postsLimitPerMonth: number;
  };
}

interface MemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
  profiles: Array<Profile>;
}

export const createResolvers = (fastify: FastifyInstance) => ({
  Query: {
    memberTypes: async () => {
      const memberTypes = await fastify.prisma.memberType.findMany();
      return memberTypes || [];
    },
    memberType: async (_: unknown, { id }: { id: MemberTypeId }) => {
      const memberType = await fastify.prisma.memberType.findUnique({
        where: { id },
        include: {
          profiles: {
            include: {
              user: true,
              memberType: true,
            },
          },
        },
      });
      return memberType || null;
    },
    posts: async () => {
      const posts = await fastify.prisma.post.findMany({
        include: {
          author: true,
        },
      });
      return posts || [];
    },
    post: async (_: unknown, { id }: { id: string }) => {
      const post = await fastify.prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });
      return post || null;
    },
    users: async () => {
      const users = await fastify.prisma.user.findMany({
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          posts: true,
          userSubscribedTo: {
            include: {
              author: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
                    },
                  },
                  posts: true,
                  userSubscribedTo: {
                    include: {
                      author: true,
                    },
                  },
                  subscribedToUser: {
                    include: {
                      subscriber: true,
                    },
                  },
                },
              },
            },
          },
          subscribedToUser: {
            include: {
              subscriber: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
                    },
                  },
                  posts: true,
                  userSubscribedTo: {
                    include: {
                      author: true,
                    },
                  },
                  subscribedToUser: {
                    include: {
                      subscriber: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return users || [];
    },
    user: async (_: unknown, { id }: { id: string }) => {
      const user = await fastify.prisma.user.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          posts: true,
          userSubscribedTo: {
            include: {
              author: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
                    },
                  },
                  posts: true,
                  userSubscribedTo: {
                    include: {
                      author: true,
                    },
                  },
                  subscribedToUser: {
                    include: {
                      subscriber: true,
                    },
                  },
                },
              },
            },
          },
          subscribedToUser: {
            include: {
              subscriber: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
                    },
                  },
                  posts: true,
                  userSubscribedTo: {
                    include: {
                      author: true,
                    },
                  },
                  subscribedToUser: {
                    include: {
                      subscriber: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return user || null;
    },
    profiles: async () => {
      const profiles = await fastify.prisma.profile.findMany({
        include: {
          user: true,
          memberType: true,
        },
      });
      return profiles || [];
    },
    profile: async (_: unknown, { id }: { id: string }) => {
      const profile = await fastify.prisma.profile.findUnique({
        where: { id },
        include: {
          user: true,
          memberType: true,
        },
      });
      return profile || null;
    },
  },
  User: {
    profile: (parent: User) => (parent && parent.profile ? parent.profile : null),
    posts: (parent: User) => (parent && parent.posts ? parent.posts : []),
    userSubscribedTo: (parent: User) => {
      if (!parent || !parent.userSubscribedTo) return [];
      return parent.userSubscribedTo
        .map((item) => item.author)
        .filter((author): author is User => author !== null && author !== undefined);
    },
    subscribedToUser: (parent: User) => {
      if (!parent || !parent.subscribedToUser) return [];
      return parent.subscribedToUser
        .map((item) => item.subscriber)
        .filter((subscriber): subscriber is User => subscriber !== null && subscriber !== undefined);
    },
  },
  Profile: {
    user: (parent: Profile) => (parent && parent.user ? parent.user : null),
    memberType: (parent: Profile) => (parent && parent.memberType ? parent.memberType : null),
  },
  Post: {
    author: (parent: Post) => (parent && parent.author ? parent.author : null),
  },
  MemberType: {
    profiles: (parent: MemberType) => (parent && parent.profiles ? parent.profiles : []),
  },
}); 