import { FastifyInstance } from 'fastify';
import { MemberTypeId } from '../member-types/schemas.js';
import { GraphQLResolveInfo } from 'graphql';

interface User {
  id: string;
  name: string;
  balance: number;
  profile?: Profile;
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
  memberType: {
    id: MemberTypeId;
    discount: number;
    postsLimitPerMonth: number;
  };
}

interface MemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export const resolvers = (fastify: FastifyInstance) => ({
  Query: {
    memberTypes: async () => {
      return fastify.prisma.memberType.findMany();
    },
    memberType: async ({ id }: { id: string }) => {
      return fastify.prisma.memberType.findUnique({
        where: { id },
      });
    },
    posts: async () => {
      return fastify.prisma.post.findMany({
        include: {
          author: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    post: async ({ id }: { id: string }) => {
      return fastify.prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    users: async () => {
      return fastify.prisma.user.findMany({
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          userSubscribedTo: {
            include: {
              author: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
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
                },
              },
            },
          },
        },
      });
    },
    user: async ({ id }: { id: string }) => {
      return fastify.prisma.user.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          userSubscribedTo: {
            include: {
              author: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
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
                },
              },
            },
          },
        },
      });
    },
    profiles: async () => {
      return fastify.prisma.profile.findMany({
        include: {
          user: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
          memberType: true,
        },
      });
    },
    profile: async ({ id }: { id: string }) => {
      return fastify.prisma.profile.findUnique({
        where: { id },
        include: {
          user: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
          memberType: true,
        },
      });
    },
  },
  Mutation: {
    createUser: async ({ dto }: { dto: { name: string; balance: number } }) => {
      return fastify.prisma.user.create({
        data: dto,
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          userSubscribedTo: {
            include: {
              author: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
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
                },
              },
            },
          },
        },
      });
    },
    createProfile: async ({ dto }: { dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: string } }) => {
      return fastify.prisma.profile.create({
        data: dto,
        include: {
          user: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
          memberType: true,
        },
      });
    },
    createPost: async ({ dto }: { dto: { title: string; content: string; authorId: string } }) => {
      return fastify.prisma.post.create({
        data: dto,
        include: {
          author: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    changeUser: async ({ id, dto }: { id: string; dto: { name?: string; balance?: number } }) => {
      return fastify.prisma.user.update({
        where: { id },
        data: dto,
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          userSubscribedTo: {
            include: {
              author: {
                include: {
                  profile: {
                    include: {
                      memberType: true,
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
                },
              },
            },
          },
        },
      });
    },
    changeProfile: async ({ id, dto }: { id: string; dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: string } }) => {
      return fastify.prisma.profile.update({
        where: { id },
        data: dto,
        include: {
          user: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
          memberType: true,
        },
      });
    },
    changePost: async ({ id, dto }: { id: string; dto: { title?: string; content?: string } }) => {
      return fastify.prisma.post.update({
        where: { id },
        data: dto,
        include: {
          author: {
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              userSubscribedTo: {
                include: {
                  author: {
                    include: {
                      profile: {
                        include: {
                          memberType: true,
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
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    deleteUser: async ({ id }: { id: string }) => {
      await fastify.prisma.user.delete({
        where: { id },
      });
      return id;
    },
    deletePost: async ({ id }: { id: string }) => {
      await fastify.prisma.post.delete({
        where: { id },
      });
      return id;
    },
    deleteProfile: async ({ id }: { id: string }) => {
      await fastify.prisma.profile.delete({
        where: { id },
      });
      return id;
    },
    subscribeTo: async ({ userId, authorId }: { userId: string; authorId: string }) => {
      await fastify.prisma.subscribersOnAuthors.create({
        data: {
          subscriberId: userId,
          authorId,
        },
      });
      return userId;
    },
    unsubscribeFrom: async ({ userId, authorId }: { userId: string; authorId: string }) => {
      await fastify.prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId,
          },
        },
      });
      return userId;
    },
  },
  User: {
    userSubscribedTo: (parent: User) => {
      if (!parent.userSubscribedTo) return [];
      return parent.userSubscribedTo.map((sub) => sub.author).filter((user): user is User => user !== null);
    },
    subscribedToUser: (parent: User) => {
      if (!parent.subscribedToUser) return [];
      return parent.subscribedToUser.map((sub) => sub.subscriber).filter((user): user is User => user !== null);
    },
  },
  Post: {
    author: (parent: Post) => parent.author,
  },
  Profile: {
    user: (parent: Profile) => parent.user,
    memberType: (parent: Profile) => parent.memberType,
  },
}); 
