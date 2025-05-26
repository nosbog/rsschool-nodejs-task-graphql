import DataLoader from 'dataloader';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export const createLoaders = (prisma) => ({
  profileByUserId: new DataLoader(async (userIds) => {
    const profiles = await prisma.profile.findMany({ where: { userId: { in: userIds as string[] } } });
    return userIds.map(id => profiles.find(p => p.userId === id) || null);
  }),
  postsByUserId: new DataLoader(async (userIds) => {
    const posts = await prisma.post.findMany({ where: { authorId: { in: userIds as string[] } } });
    return userIds.map(id => posts.filter(p => p.authorId === id));
  }),
  userSubscriptions: new DataLoader(async (userIds) => {
    const subs = await prisma.subscription.findMany({
      where: { subscriberId: { in: userIds as string[] } },
      include: { author: true }
    });
    return userIds.map(id => subs.filter(s => s.subscriberId === id).map(s => s.author));
  }),
  userSubscribers: new DataLoader(async (userIds) => {
    const subs = await prisma.subscription.findMany({
      where: { authorId: { in: userIds as string[] } },
      include: { subscriber: true }
    });
    return userIds.map(id => subs.filter(s => s.authorId === id).map(s => s.subscriber));
  })
});

export const resolvers = {
  RootQueryType: {
    users: async (_root, _args, ctx, info) => {
      const resolveTree = parseResolveInfo(info);
      const needsSubs = resolveTree?.fields?.User?.fields?.userSubscribedTo || resolveTree?.fields?.User?.fields?.subscribedToUser;

      const users = await ctx.prisma.user.findMany({
        include: needsSubs ? {
          userSubscribedTo: true,
          subscribedToUser: true
        } : undefined
      });

      users.forEach(u => {
        ctx.loaders.profileByUserId.prime(u.id, u.profile);
        ctx.loaders.postsByUserId.prime(u.id, u.posts);
      });

      return users;
    },
    user: async (_root, { id }, ctx) => ctx.prisma.user.findUnique({ where: { id } }),
    posts: (_root, _args, ctx) => ctx.prisma.post.findMany(),
    post: (_root, { id }, ctx) => ctx.prisma.post.findUnique({ where: { id } }),
    profiles: (_root, _args, ctx) => ctx.prisma.profile.findMany(),
    profile: (_root, { id }, ctx) => ctx.prisma.profile.findUnique({ where: { id } }),
    memberTypes: (_root, _args, ctx) => ctx.prisma.memberType.findMany(),
    memberType: (_root, { id }, ctx) => ctx.prisma.memberType.findUnique({ where: { id } }),
  },
  User: {
    profile: (parent, _args, ctx) => ctx.loaders.profileByUserId.load(parent.id),
    posts: (parent, _args, ctx) => ctx.loaders.postsByUserId.load(parent.id),
    userSubscribedTo: (parent, _args, ctx) => ctx.loaders.userSubscriptions.load(parent.id),
    subscribedToUser: (parent, _args, ctx) => ctx.loaders.userSubscribers.load(parent.id),
  },
  Mutations: {
    createUser: (_root, { dto }, ctx) => ctx.prisma.user.create({ data: dto }),
    createProfile: (_root, { dto }, ctx) => ctx.prisma.profile.create({ data: dto }),
    createPost: (_root, { dto }, ctx) => ctx.prisma.post.create({ data: dto }),
    changePost: (_root, { id, dto }, ctx) => ctx.prisma.post.update({ where: { id }, data: dto }),
    changeProfile: (_root, { id, dto }, ctx) => ctx.prisma.profile.update({ where: { id }, data: dto }),
    changeUser: (_root, { id, dto }, ctx) => ctx.prisma.user.update({ where: { id }, data: dto }),
    deleteUser: (_root, { id }, ctx) => ctx.prisma.user.delete({ where: { id } }).then(() => "Deleted"),
    deletePost: (_root, { id }, ctx) => ctx.prisma.post.delete({ where: { id } }).then(() => "Deleted"),
    deleteProfile: (_root, { id }, ctx) => ctx.prisma.profile.delete({ where: { id } }).then(() => "Deleted"),
    subscribeTo: (_root, { userId, authorId }, ctx) => ctx.prisma.subscription.create({ data: { subscriberId: userId, authorId } }).then(() => "Subscribed"),
    unsubscribeFrom: (_root, { userId, authorId }, ctx) => ctx.prisma.subscription.deleteMany({ where: { subscriberId: userId, authorId } }).then(() => "Unsubscribed"),
  }
};
