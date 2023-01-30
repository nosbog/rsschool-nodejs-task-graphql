const resolver = {
  Query: {
    posts: async (a: any, b: any, context: any, d: any) => {
      const posts = await context.db.posts.findMany();
      return posts;
    },
  },
};

export default resolver;
